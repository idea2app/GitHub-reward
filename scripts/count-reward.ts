import { readAll } from "https://deno.land/std/streams/conversion.ts";
import { parse, stringify } from "https://deno.land/std/encoding/yaml.ts";

const input = new TextDecoder().decode(await readAll(Deno.stdin));
const rewards = parse(input);

const groupedRewards = Object.groupBy(rewards, ({ id }) => id);

const summaryArray = Object.entries(groupedRewards).map(([id, rewards]) => {
  const reward = rewards.reduce((acc, { currency, reward }) => {
    acc[currency] ??= 0;
    acc[currency] += reward;
    return acc;
  }, {});

  return { id, reward };
});

console.log(stringify(summaryArray));
