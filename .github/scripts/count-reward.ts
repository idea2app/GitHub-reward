import { $, YAML } from "npm:zx";

import { Reward } from "./type.ts";

$.verbose = true;

const rawTags =
  await $`git tag --list "reward-*" --format="%(refname:short) %(creatordate:short)"`;

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastMonthStr = lastMonth.toJSON().slice(0, 7);

const rewardTags = rawTags.stdout
  .split("\n")
  .filter((line) => line.split(/\s+/)[1] >= lastMonthStr)
  .map((line) => line.split(/\s+/)[0]);

let rawYAML = "";

for (const tag of rewardTags)
  rawYAML += await $`git tag -l --format="%(contents)" ${tag}`;

const rewards = YAML.parse(rawYAML) as Reward[];

const groupedRewards = Object.groupBy(rewards, ({ id }) => id);

const summaryList = Object.entries(groupedRewards).map(([id, rewards]) => {
  const reward = rewards!.reduce((acc, { currency, reward }) => {
    acc[currency] ??= 0;
    acc[currency] += reward;
    return acc;
  }, {} as Record<string, number>);

  return { id, reward };
});

const summaryText = YAML.stringify(summaryList);

console.log(summaryText);

const tagName = `statistic-${new Date().toJSON().slice(0, 7)}`;

await $`git config --global user.name "github-actions[bot]"`;
await $`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;

await $`git tag -a ${tagName} $(git rev-parse HEAD) -m ${summaryText}`;
await $`git push origin --tags`;

await $`gh release create ${tagName} --notes ${summaryText}`;
