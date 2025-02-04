import { stringify } from "https://deno.land/std/encoding/yaml.ts";

const [currency, reward, ...users] = Deno.args;

const averageReward = (parseFloat(reward) / users.length).toFixed(2);

const list = users.map((login) => ({
  id: `@${login}`,
  currency,
  reward: parseFloat(averageReward),
}));
console.log(stringify(list));
