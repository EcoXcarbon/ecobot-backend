import questions from './quizQuestions.js';

export default function getRandomQuestions(count = 5) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
