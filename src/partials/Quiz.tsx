import { options, getQuestions } from '@/utils/quiz';

const Rating = () => {
  return (
    <>
      {Object.keys(options).map(option => <p key={options[option]}>{option}</p>)}
    </>
  )

}

const QuizQuestion = ({ question}: { question: string}) => {
  return (
    <tr>
      <td className="border border-gray-300">
        <p className="py-1 text-base">{question}</p>
      </td>
      <td className="border border-gray-300">
        <Rating />
      </td>
    </tr>
  )
};

const Quiz = () => {
  const questions = getQuestions();

  return (
    <div className="mx-auto max-w-screen-lg px-3">
      <p className="pb-6 text-lg">
        Please rate yourself (or the person you are evaluating) on each of the
        symptoms listed below using the following scale.
        <br />
        If possible, also have someone else rate you or the other person (such as a spouse, lover or parent).
        <br />
        This is done to obtain a more complete picture of the situation
      </p>
      <table className="border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300">Question</th>
            <th className="border border-gray-300">Rating</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <QuizQuestion question={q} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Quiz };
