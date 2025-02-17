/* eslint-disable no-restricted-syntax */
import questionData from '@/data/questions.json';

type QuestionCategory = {
  number: number;
  range: number[];
  link: string;
  comorbidity?: string;
};

const CATEGORIES: Record<string, QuestionCategory> = {
  inattentive: {
    number: 1,
    range: [1, 9],
    link: 'https://www.amenclinics.com/blog/know-the-add-types-week-2-inattentive-add/',
  },
  hyperactivity: {
    // aka impulsivity or classic ADHD
    number: 2,
    range: [10, 18],
    link: 'https://www.amenclinics.com/blog/get-to-know-the-add-types-week-1-classic-add/',
  },
  overfocused: {
    number: 3,
    range: [19, 31],
    link: 'https://www.amenclinics.com/blog/overfocused-add',
    comorbidity: 'obsessive compulsive disorder',
  },
  temporal: {
    number: 4,
    range: [32, 44],
    link: 'https://www.amenclinics.com/blog/behavior-problems-or-brain-trauma-week-4-of-7-temporal-lobe-add/',
  },
  limbic: {
    number: 5,
    range: [45, 53],
    link: 'https://www.amenclinics.com/blog/when-depression-add-intersect-week-5-of-7-limbic-add/',
    comorbidity: 'depressive disorder',
  },
  ring_of_fire: {
    number: 6,
    range: [54, 63],
    link: 'https://www.amenclinics.com/blog/a-very-busy-brain-week-6-of-7-ring-of-fire-add/',
    comorbidity: 'bipolar disorder',
  },
  anxious: {
    number: 7,
    range: [64, 70],
    link: 'https://www.amenclinics.com/blog/the-mother-of-perpetual-worry-week-7-of-7-anxious-add/',
    comorbidity: 'generalized anxiety disorder',
  },
} as const;

type Answers = Record<number, number>;

type Category = keyof typeof CATEGORIES;

type CategoryResult = {
  score: number;
  isInattentive: boolean;
  qualifies: boolean;
  nearlyQualified: boolean;
  category: string;
  categoryNumber: number;
  explanation: string;
  categoryLink: string;
  comorbidity?: string;
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

export const optionDescriptions = {
  Never: 'Does not occur at all',
  Rarely: 'Happens once a month or less',
  Occasionally: 'Happens once a week or less',
  Frequently: 'Happens multiple times times a week',
  'Very Frequently': 'Happens daily or almost every day',
};

function invertObject(obj) {
  const inverted = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      inverted[obj[key]] = key;
    }
  }
  return inverted;
}

export const invertedOptions = invertObject(options);

function processQuestions(): Question[] {
  return questionData.map(
    (q, idx) =>
      ({
        ...q,
        index: idx,
      } as Question)
  );
}

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
  const { range } = CATEGORIES[category];
  const rangeMsg = `(questions ${range[0]}-${range[1]})`;

  const basicallyQualified = qualifies || nearly;

  const verb1 = basicallyQualified ? 'met' : 'did not meet';
  const verb2 = basicallyQualified ? 'scored' : 'did not score';

  const cat = humanize(category).toLowerCase();

  const minScore = nearly ? 2 : 3;
  const nearlyMsg = nearly ? 'nearly ' : '';
  const tot = range[1] - range[0] + 1;

  if (category === 'inattentive' || category === 'hyperactivity') {
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

  const verb3 = isInattentive ? 'met' : 'did not meet';
  const verb4 = basicallyQualified ? 'scored' : 'did not score';

  return `You ${nearlyMsg}met the criteria for this ADD subtype because you ${verb3} the criteria
    for inattentiveness and ${verb4} ${minScore}+ on at least 4 (${score}/${tot}) of the ${cat} questions ${rangeMsg}
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
  const isInattentive = determineIsCoreType(answers, 'inattentive');
  const isImpulsive = determineIsCoreType(answers, 'hyperactivity');
  const perCategory: Result = {};

  for (const category of Object.keys(CATEGORIES)) {
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
      categoryNumber: CATEGORIES[category].number,
      categoryLink: CATEGORIES[category].link,
      comorbidity:
        qualifies || nearlyQualified ? CATEGORIES[category].comorbidity : null,
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

export function serializeAnswer(
  existing: string,
  index: number,
  ratingNumber: number
): string {
  const entry = `${index}${ratingNumber}`;
  if (existing) {
    return `${existing}_${entry}`;
  }
  return entry;
}

export function deserializeAnswers(answers: string): Record<number, number> {
  return answers.split('_').reduce((acc, answer) => {
    const index = answer.substring(0, answer.length - 1);
    const rating = answer.substring(answer.length - 1, answer.length);

    acc[index] = Number(rating);
    return acc;
  }, {});
}
