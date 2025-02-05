import "zx/globals";

$.verbose = true;

const rawTags =
  await $`git tag --list "reward-*" --format="%(refname:short) %(creatordate:short)"`;

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastMonthStr = lastMonth.toISOString().slice(0, 7);

const rewardTags = rawTags.stdout
  .split("\n")
  .filter(line => line.split(" ")[1] >= lastMonthStr)
  .map(line => line.split(" ")[0]);

let rawYAML = "";

for (const tag of rewardTags)
  rawYAML += await $`git tag -l --format="%(contents)" ${tag}`;

const rewards = YAML.parse(rawYAML) as Reward[];

const groupedRewards = Object.groupBy(rewards, ({ id }) => id);

const summaryArray = Object.entries(groupedRewards).map(([id, rewards]) => {
  const reward = rewards!.reduce((acc, { currency, reward }) => {
    acc[currency] ??= 0;
    acc[currency] += reward;
    return acc;
  }, {} as Record<string, number>);

  return { id, reward };
});

console.log(YAML.stringify(summaryArray));
