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
  nearlyQualified: boolean;
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

function getExplanation(
  category,
  qualifies,
  isInattentive,
  score,
  nearly = false
) {
  const range = CATEGORY_QUESTION_RANGES[category];
  const rangeMsg = `(questions ${range[0]}-${range[1]})`;

  const basicallyQualified = qualifies || nearly;

  const verb1 = basicallyQualified ? 'met' : 'did not meet';
  const verb2 = basicallyQualified ? 'scored' : 'did not score';

  const cat = humanize(category).toLowerCase();

  const minScore = nearly ? 2 : 3;
  const nearlyMsg = nearly ? 'nearly ' : '';

  if (category === 'inattentive' || category === 'hyperactivity') {
    const tot = range[1] - range[0];
    let msg = `You ${nearlyMsg}${verb1} the criteria for this ADD subtype because you ${verb2} ${minScore}+ on at least 4 (${score}/${tot}) of the
    ${cat} questions ${rangeMsg}
    `;
    if (nearly) {
      msg = `${msg}. If you had met ${
        minScore + 1
      }+ on 4, you would have qualified`;
    }
    return msg;
  }

  const iaRange = CATEGORY_QUESTION_RANGES.inattentive;
  const iaRangeMsg = `(questions ${iaRange[0]}-${iaRange[1]})`;
  const tot = iaRange[1] - iaRange[0];

  const verb3 = isInattentive ? 'met' : 'did not meet';
  const verb4 = basicallyQualified ? 'scored' : 'did not score';

  return `You ${nearlyMsg}met the criteria for this ADD subtype because you ${verb3} the criteria
    for inattentiveness ${iaRangeMsg} and ${verb4} ${minScore}+ on at least 4 (${score}/${tot}) of the ${cat} questions ${rangeMsg}
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

    const nearScore = categoryQs.reduce((acc, q) => {
      const answer = Number(answers[q.index] || 0);
      return acc + (answer >= 2 ? 1 : 0);
    }, 0);

    const qualifies =
      isImpulsive && category === 'hyperactivity'
        ? true
        : isInattentive && score >= 4;

    const nearlyQualified =
      isImpulsive && category === 'hyperactivity'
        ? true
        : isInattentive && nearScore >= 4;

    const result = {
      score,
      isInattentive,
      isImpulsive,
      qualifies,
      nearlyQualified: qualifies ? false : nearlyQualified,
      category,
      categoryNumber: CATEGORY_NUMS[category],
      explanation: getExplanation(
        category,
        qualifies,
        isInattentive,
        qualifies ? score : nearlyQualified ? nearScore : score,
        qualifies ? false : nearlyQualified
      ),
    };

    perCategory[category] = result;
  }

  return perCategory;
}
