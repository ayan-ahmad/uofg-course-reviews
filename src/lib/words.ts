const adjectives = [
  'Brave', 'Clever', 'Calm', 'Daring', 'Eager', 'Fierce', 'Gentle',
  'Happy', 'Jolly', 'Kind', 'Lively', 'Mighty', 'Noble', 'Quick',
  'Rapid', 'Swift', 'Tidy', 'Vast', 'Wise', 'Zesty', 'Bright',
  'Crisp', 'Deep', 'Grand', 'Keen', 'Meek', 'Pure', 'Rare', 'Slim',
  'Tall', 'Sharp', 'Bold', 'Cool', 'Fair', 'Gold', 'Iron', 'Jade',
  'Lush', 'Mint', 'Navy', 'Opal', 'Pink', 'Ruby', 'Sage', 'Teal',
];

const nouns = [
  'Penguin', 'Tiger', 'Falcon', 'Otter', 'Wolf', 'Eagle', 'Panda',
  'Fox', 'Lynx', 'Bear', 'Hawk', 'Deer', 'Crane', 'Raven', 'Cobra',
  'Heron', 'Bison', 'Viper', 'Moose', 'Finch', 'Gecko', 'Ibis',
  'Kite', 'Lark', 'Mole', 'Newt', 'Robin', 'Toad', 'Vole', 'Wren',
  'Zebra', 'Badger', 'Coyote', 'Dingo', 'Egret', 'Ferret', 'Gopher',
  'Hyena', 'Iguana', 'Jackal', 'Koala', 'Lemur', 'Marten', 'Numbat',
];

export function generateName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
}
