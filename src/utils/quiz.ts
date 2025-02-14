/* eslint-disable no-restricted-syntax */
import questionData from '@/data/questions.json';

const CATEGORIES = [
  'inattentive',
  'hyperactivity', // aka impulsivity
  'overfocused',
  'temporal',
  'limbic',
  'ring_of_fire',
  'anxious',
] as const;

const CATEGORY_NUMS = {
  inattentive: 1,
  hyperactivity: 2,
  overfocused: 3,
  temporal: 4,
  limbic: 5,
  ring_of_fire: 6,
  anxious: 7,
};

const CATEGORY_QUESTION_RANGES = {
  inattentive: [1, 9],
  hyperactivity: [10, 18],
  overfocused: [19, 31],
  temporal: [32, 44],
  limbic: [45, 53],
  ring_of_fire: [54, 63],
  anxious: [64, 70],
};

type Answers = Record<number, number>;

type Category = (typeof CATEGORIES)[number];
type CategoryResult = {
  score: number;
  isInattentive: boolean;
  qualifies: boolean;
  category: string;
  categoryNumber: number;
  explanation: string;
};
type Result = {
  [key in Category]: CategoryResult;
};

type Question = {
  text: string;
  category: Category;
  index: number;
};

export const options = {
  Never: 0,
  Rarely: 1,
  Occasionally: 2,
  Frequently: 3,
  'Very Frequently': 4,
  // 'Not Applicable/Not Known': null,
};

function processQuestions(): Question[] {
  return questionData.map(
    (q, idx) =>
      ({
        ...q,
        index: idx,
      } as Question)
  );
}

// ?answers=%2C0%3D0%2C1%3D1%2C2%3D2%2C3%3D3%2C4%3D2
export const questions: Question[] = processQuestions();

function determineIsCoreType(answers: Answers, category: string): boolean {
  const categoryQs = questions.filter((q) => q.category === category);
  const qualifyingAnswers = categoryQs.filter((q) => answers[q.index] >= 3);

  return qualifyingAnswers.length >= 4;
}

export function humanize(str) {
  const frags = str.split('_');
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

function getExplanation(category, qualifies, isInattentive, score) {
  const range = CATEGORY_QUESTION_RANGES[category];
  const rangeMsg = `(questions ${range[0]}-${range[1]})`;

  const verb1 = qualifies ? 'met' : 'did not meet';
  const verb2 = qualifies ? 'scored' : 'did not score';

  const cat = humanize(category).toLowerCase();

  if (category === 'inattentive' || category === 'hyperactivity') {
    return `You ${verb1} the criteria for this ADD subtype because you ${verb2} 3+ on 4 of the
    ${cat} questions ${rangeMsg} (your total score was ${score})
    `;
  }

  const iaRange = CATEGORY_QUESTION_RANGES.inattentive;
  const iaRangeMsg = `(questions ${iaRange[0]}-${iaRange[1]})`;

  const verb3 = isInattentive ? 'met' : 'did not meet';
  const verb4 = score >= 4 ? 'scored' : 'did not score';

  return `You met the criteria for this ADD subtype because you ${verb3} the criteria
    for inattentiveness ${iaRangeMsg} and ${verb4} 3+ on 4 of the ${cat} questions ${rangeMsg}
    (your total score was ${score})
  `;
}

/**
 * Evaluate a user's quiz submission.
 * See https://s3.amazonaws.com/Amenclinics/BBT/HealingADDBrainTypeTest.pdf , p6.
 *
 * Inattentive:
 *   4+ with score of 3-4 is needed to make the diagnosis
 *   Does not score 2+ on hyperactivity
 *
 * @param answers: Maps the question index to the rating the user chose
 * @returns
 */
export function scoreAnswers(answers: Answers): Result {
  console.log('answers', answers);

  const isInattentive = determineIsCoreType(answers, 'inattentive');
  const isImpulsive = determineIsCoreType(answers, 'hyperactivity');
  const perCategory: Result = {};

  for (const category of CATEGORIES) {
    const categoryQs = questions.filter((q) => q.category === category);

    const score = categoryQs.reduce((acc, q) => {
      const answer = Number(answers[q.index] || 0);
      return acc + (answer >= 3 ? 1 : 0);
    }, 0);

    const qualifies =
      isImpulsive && category === 'hyperactivity'
        ? true
        : isInattentive && score >= 4;

    const result = {
      score,
      isInattentive,
      isImpulsive,
      qualifies,
      category,
      categoryNumber: CATEGORY_NUMS[category],
      explanation: getExplanation(category, qualifies, isInattentive, score),
    };

    perCategory[category] = result;
  }

  return perCategory;
}
