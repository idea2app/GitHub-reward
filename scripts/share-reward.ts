import { components } from "npm:@octokit/openapi-types";
import { $, YAML, argv, fs } from "npm:zx";

$.verbose = true;

const [currency, reward, PR_URL, targetFile] = argv._;

interface PRMeta {
  author: components["schemas"]["simple-user"];
  assignees: components["schemas"]["simple-user"][];
}

const { author, assignees }: PRMeta = await (
  await $`gh pr view ${PR_URL} --json author,assignees`
).json();

const users = [author.login, ...assignees.map(({ login }) => login)];

const averageReward = (parseFloat(reward) / users.length).toFixed(2);

const list: Reward[] = users.map((login) => ({
  id: `@${login}`,
  currency,
  reward: parseFloat(averageReward),
}));
const listText = YAML.stringify(list);

if (targetFile) await fs.outputFile(targetFile, listText);
else console.log(listText);
