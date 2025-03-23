import { components } from "npm:@octokit/openapi-types";
import { $, argv, YAML } from "npm:zx";

import { Reward } from "./type.ts";

$.verbose = true;

const [
  repositoryOwner,
  repositoryName,
  issueNumber,
  issueAuthor,
  currency,
  reward,
] = argv._;

interface PRMeta {
  author: components["schemas"]["simple-user"];
  assignees: components["schemas"]["simple-user"][];
}

const PR_URL = await $`gh api graphql -f query='{
  repository(owner: "${repositoryOwner}", name: "${repositoryName}") {
    issue(number: ${issueNumber}) {
      closedByPullRequestsReferences(first: 10) {
        nodes {
          url
          merged
        }
      }
    }
  }
}' --jq '.data.repository.issue.closedByPullRequestsReferences.nodes[] | select(.merged == true) | .url' | head -n 1`;

if (!PR_URL.text().trim())
  throw new ReferenceError("No merged PR is found for the given issue number.");

const { author, assignees }: PRMeta = await (
  await $`gh pr view ${PR_URL} --json author,assignees`
).json();

const users = [author.login, ...assignees.map(({ login }) => login)];

const averageReward = (parseFloat(reward) / users.length).toFixed(2);

const list: Reward[] = users.map((login) => ({
  issue: `#${issueNumber}`,
  payer: `@${issueAuthor}`,
  payee: `@${login}`,
  currency,
  reward: parseFloat(averageReward),
}));
const listText = YAML.stringify(list);

console.log(listText);

await $`git config --global user.name "github-actions[bot]"`;
await $`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;
await $`git tag -a "reward-${issueNumber}" -m ${listText}`;
await $`git push origin --tags`;

const commentBody = `## Reward data

\`\`\`yml
${listText}
\`\`\`
`;
await $`gh issue comment ${issueNumber} --body ${commentBody}`;
