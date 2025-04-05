export const questions = [
  {
    question: "What is the main cause of climate change?",
    options: ["Deforestation", "Carbon emissions", "Volcanic activity", "Earthquakes"],
    answer: "Carbon emissions",
  },
  {
    question: "Which gas is most responsible for the greenhouse effect?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide",
  },
  {
    question: "Which renewable energy is harnessed from the sun?",
    options: ["Wind", "Geothermal", "Solar", "Hydropower"],
    answer: "Solar",
  },
  {
    question: "Which of the following helps reduce carbon footprint?",
    options: ["Burning plastic", "Using fossil fuels", "Planting trees", "Driving more"],
    answer: "Planting trees",
  },
  {
    question: "What does ECO stand for in EcoCoin?",
    options: ["Economic", "Ecological", "Ecosystem", "Eco-friendly"],
    answer: "Eco-friendly",
  },
  {
    question: "What is the primary benefit of afforestation?",
    options: ["Increasing pollution", "Providing plastic", "Capturing carbon dioxide", "Causing erosion"],
    answer: "Capturing carbon dioxide",
  },
  {
    question: "Which of these is a greenhouse gas?",
    options: ["Methane", "Argon", "Helium", "Neon"],
    answer: "Methane",
  },
  {
    question: "How can individuals help fight climate change?",
    options: ["Use more coal", "Recycle and reuse", "Drive gasoline cars more", "Burn waste"],
    answer: "Recycle and reuse",
  },
  {
    question: "Which of these sources does NOT produce renewable energy?",
    options: ["Coal", "Solar", "Wind", "Hydropower"],
    answer: "Coal",
  },
  {
    question: "Why is climate literacy important?",
    options: ["To ignore global trends", "To understand weather", "To take informed actions", "To grow food"],
    answer: "To take informed actions",
  },
  {
    question: "Which country emits the most carbon dioxide annually?",
    options: ["India", "USA", "China", "Russia"],
    answer: "China",
  },
  {
    question: "Which human activity increases CO₂ levels the most?",
    options: ["Walking", "Flying planes", "Swimming", "Biking"],
    answer: "Flying planes",
  },
  {
    question: "Which of the following is biodegradable?",
    options: ["Plastic", "Aluminum foil", "Banana peel", "Glass bottle"],
    answer: "Banana peel",
  },
  {
    question: "What is the main goal of the Paris Agreement?",
    options: ["Increase emissions", "Promote travel", "Limit global warming", "Deforest areas"],
    answer: "Limit global warming",
  },
  {
    question: "Which industry contributes most to deforestation?",
    options: ["IT sector", "Textile industry", "Agriculture", "Automobile"],
    answer: "Agriculture",
  },
  {
    question: "Which of these is considered a carbon sink?",
    options: ["Ocean", "Concrete", "Plastic", "Oil"],
    answer: "Ocean",
  },
  {
    question: "What’s the impact of melting glaciers?",
    options: ["Better skiing", "Sea level rise", "Lower humidity", "More deserts"],
    answer: "Sea level rise",
  },
  {
    question: "Which type of diet has lower carbon footprint?",
    options: ["Meat-heavy diet", "Vegan diet", "Seafood-only diet", "Junk food diet"],
    answer: "Vegan diet",
  },
  {
    question: "What is the process of trapping sun's heat by gases called?",
    options: ["Greenhouse effect", "Solar flaring", "Global heating", "Heat retention"],
    answer: "Greenhouse effect",
  },
  {
    question: "Which organization assesses climate change science globally?",
    options: ["IPCC", "UNICEF", "NASA", "WWF"],
    answer: "IPCC",
  }
];

let lastQuestions = [];
const RECENT_QUESTION_LIMIT = 5;

export function getRandomQuestion() {
  let question;
  let attempts = 0;

  do {
    question = questions[Math.floor(Math.random() * questions.length)];
    attempts++;
  } while (lastQuestions.includes(question.question) && attempts < 10);

  lastQuestions.push(question.question);
  if (lastQuestions.length > RECENT_QUESTION_LIMIT) {
    lastQuestions.shift();
  }

  return question;
}
