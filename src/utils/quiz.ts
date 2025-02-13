import questions from '@/data/questions.json';

export const options = {
  Never: 0,
  Rarely: 1,
  Occasionally: 2,
  Frequently: 3,
  'Very Frequently': 4,
  'Not Applicable/Not Known': null,
};

export function getQuestions() {
  return questions;
}
