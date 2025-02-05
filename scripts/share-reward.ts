import { components } from "@octokit/openapi-types";
import "zx/globals";

$.verbose = true;

const [currency, reward, PR_URL] = argv._;

interface PRMeta {
  author: components["schemas"]["simple-user"];
  assignees: components["schemas"]["simple-user"][];
}

const { author, assignees }: PRMeta = await (
  await $`gh pr view ${PR_URL} --json author,assignees`
).json();

const users = [author.login, ...assignees.map(({ login }) => login)];

const averageReward = (parseFloat(reward) / users.length).toFixed(2);

const list: Reward[] = users.map(login => ({
  id: `@${login}`,
  currency,
  reward: parseFloat(averageReward)
}));
console.log(YAML.stringify(list));
