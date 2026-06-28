import { db } from '../src/db/index.ts';
import { users, reviews } from '../src/db/schema.ts';
import { generateName } from '../src/lib/words.ts';
import { randomUUID } from 'crypto';

const existing = await db.select().from(reviews).limit(1);
if (existing.length > 0) {
  console.log('DB already seeded — skipping.');
  process.exit(0);
}

const now = Math.floor(Date.now() / 1000);
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Deterministic names for reproducibility
const names = [
  'BravePenguin', 'CleverOtter', 'SwiftFalcon', 'GentleWolf',
  'EagerBear', 'NobleFox', 'JollyLynx', 'KindEagle',
];

const seedUsers = names.map((displayName) => ({
  id: randomUUID(),
  displayName,
  createdAt: now - rand(100_000, 10_000_000),
}));

await db.insert(users).values(seedUsers);
console.log(`Created ${seedUsers.length} users.`);

type ReviewRow = {
  userId: string;
  courseCode: string;
  lecturerRating: number;
  workloadRating: number;
  difficultyRating: number;
  usefulnessRating: number;
  markingFairnessRating: number;
  enjoymentRating: number;
  overallRating: number;
  reviewText: string | null;
  createdAt: number;
};

const seedReviews: ReviewRow[] = [
  // COMPSCI4003 – Algorithmics II
  {
    userId: seedUsers[0].id, courseCode: 'COMPSCI4003',
    lecturerRating: 5, workloadRating: 3, difficultyRating: 4,
    usefulnessRating: 5, markingFairnessRating: 4, enjoymentRating: 4, overallRating: 5,
    reviewText: 'Excellent course. The lecturer is very engaged and the content is genuinely interesting. Challenging but rewarding.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[1].id, courseCode: 'COMPSCI4003',
    lecturerRating: 4, workloadRating: 2, difficultyRating: 5,
    usefulnessRating: 5, markingFairnessRating: 3, enjoymentRating: 3, overallRating: 4,
    reviewText: 'Hard course — NP-completeness section is brutal. But the skills carry through to everything else.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[2].id, courseCode: 'COMPSCI4003',
    lecturerRating: 4, workloadRating: 3, difficultyRating: 4,
    usefulnessRating: 4, markingFairnessRating: 4, enjoymentRating: 4, overallRating: 4,
    reviewText: null,
    createdAt: now - rand(10_000, 500_000),
  },

  // COMPSCI4004 – (assuming this exists)
  {
    userId: seedUsers[3].id, courseCode: 'COMPSCI4004',
    lecturerRating: 3, workloadRating: 4, difficultyRating: 3,
    usefulnessRating: 3, markingFairnessRating: 4, enjoymentRating: 3, overallRating: 3,
    reviewText: 'Fair course, a bit dry at times. Good for building foundational knowledge.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[4].id, courseCode: 'COMPSCI4004',
    lecturerRating: 4, workloadRating: 3, difficultyRating: 2,
    usefulnessRating: 4, markingFairnessRating: 5, enjoymentRating: 4, overallRating: 4,
    reviewText: 'Very fair marking and clear expectations throughout. Recommended.',
    createdAt: now - rand(10_000, 500_000),
  },

  // COMPSCI4025 – Maths for CS
  {
    userId: seedUsers[5].id, courseCode: 'COMPSCI4025',
    lecturerRating: 5, workloadRating: 4, difficultyRating: 5,
    usefulnessRating: 5, markingFairnessRating: 4, enjoymentRating: 3, overallRating: 4,
    reviewText: 'Intense but invaluable. You will use this everywhere. Do not skip.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[6].id, courseCode: 'COMPSCI4025',
    lecturerRating: 3, workloadRating: 5, difficultyRating: 5,
    usefulnessRating: 4, markingFairnessRating: 3, enjoymentRating: 2, overallRating: 3,
    reviewText: 'Very heavy workload and the marking can feel harsh. Useful content though.',
    createdAt: now - rand(10_000, 500_000),
  },

  // COMPSCI4061 – Networks
  {
    userId: seedUsers[7].id, courseCode: 'COMPSCI4061',
    lecturerRating: 4, workloadRating: 3, difficultyRating: 3,
    usefulnessRating: 4, markingFairnessRating: 4, enjoymentRating: 4, overallRating: 4,
    reviewText: 'Solid networking course. Well structured and the labs reinforce the theory nicely.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[0].id, courseCode: 'COMPSCI4061',
    lecturerRating: 5, workloadRating: 2, difficultyRating: 2,
    usefulnessRating: 5, markingFairnessRating: 5, enjoymentRating: 5, overallRating: 5,
    reviewText: 'One of my favourite courses. Very clear teaching and the material is genuinely relevant.',
    createdAt: now - rand(10_000, 500_000),
  },

  // COMPSCI4073 – Systems Programming
  {
    userId: seedUsers[1].id, courseCode: 'COMPSCI4073',
    lecturerRating: 4, workloadRating: 5, difficultyRating: 5,
    usefulnessRating: 5, markingFairnessRating: 3, enjoymentRating: 3, overallRating: 4,
    reviewText: 'Challenging but teaches you how computers actually work. Heavy lab work — budget your time.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[2].id, courseCode: 'COMPSCI4073',
    lecturerRating: 3, workloadRating: 5, difficultyRating: 4,
    usefulnessRating: 4, markingFairnessRating: 3, enjoymentRating: 2, overallRating: 3,
    reviewText: 'Very demanding. If you are comfortable with C you will be fine, otherwise brace yourself.',
    createdAt: now - rand(10_000, 500_000),
  },

  // COMPSCI5073 – Inf & Coding Theory (Level 5)
  {
    userId: seedUsers[3].id, courseCode: 'COMPSCI5073',
    lecturerRating: 5, workloadRating: 3, difficultyRating: 4,
    usefulnessRating: 4, markingFairnessRating: 5, enjoymentRating: 5, overallRating: 5,
    reviewText: 'Beautiful subject. Shannon entropy and error correction are fascinating. Highly recommend.',
    createdAt: now - rand(10_000, 500_000),
  },
  {
    userId: seedUsers[4].id, courseCode: 'COMPSCI5073',
    lecturerRating: 5, workloadRating: 2, difficultyRating: 3,
    usefulnessRating: 3, markingFairnessRating: 5, enjoymentRating: 4, overallRating: 4,
    reviewText: null,
    createdAt: now - rand(10_000, 500_000),
  },
];

await db.insert(reviews).values(seedReviews);
console.log(`Seeded ${seedReviews.length} reviews across ${new Set(seedReviews.map((r) => r.courseCode)).size} courses.`);
console.log('Done!');
