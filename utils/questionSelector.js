import quizQuestions from "./quizQuestions.js";

/**
 * Select 5 questions based on user's current streak day.
 * Early streaks = easier, later = harder.
 */
export function getQuestionsForDay(streakDay = 1) {
  // Cap streakDay between 1 and 60
  streakDay = Math.min(Math.max(streakDay, 1), 60);

  // Difficulty scaling: early = easy, later = harder
  const difficultyPercent = streakDay / 60; // 0 to 1

  // Slice index ranges from 0 to full length
  const total = quizQuestions.length;
  const startIndex = Math.floor((difficultyPercent * 0.5) * total); // easier range
  const endIndex = Math.floor((difficultyPercent * 1.0) * total);   // full range

  const range = quizQuestions.slice(startIndex, endIndex);

  const selected = [];
  const usedIndexes = new Set();

  while (selected.length < 5 && usedIndexes.size < range.length) {
    const rand = Math.floor(Math.random() * range.length);
    if (!usedIndexes.has(rand)) {
      usedIndexes.add(rand);
      selected.push(range[rand]);
    }
  }

  return selected;
}
