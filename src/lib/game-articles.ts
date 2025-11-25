
export type Article = {
  title: string;
  content: string;
};

export type GameArticles = {
  memory: Article[];
  logic: Article[];
  reading: Article[];
  speedReading: Article[];
  riddle: Article[];
  wordLadder: Article[];
};

export const gameArticles: GameArticles = {
  memory: [
    {
      title: "Boosts Working Memory",
      content:
        "Memory match games directly challenge your working memory, which is crucial for holding and manipulating information in your mind for short periods. Strengthening this can help you remember lists, follow multi-step instructions, and stay focused.",
    },
    {
      title: "Improves Concentration",
      content:
        "To succeed, you need to pay close attention to the location of each card. This sustained focus is a great workout for your attention span, helping you filter out distractions in other areas of your life.",
    },
    {
      title: "Enhances Visual Recognition",
      content:
        "Quickly identifying and recalling the images on the cards trains your brain's ability to recognize and differentiate between visual patterns, a skill useful in many everyday tasks.",
    },
  ],
  logic: [
    {
      title: "Strengthens Problem-Solving Skills",
      content:
        "Logic puzzles train you to identify patterns, formulate hypotheses, and test solutions. This systematic approach to problem-solving is a valuable skill that can be applied to academic, professional, and personal challenges.",
    },
    {
      title: "Enhances Analytical Reasoning",
      content:
        "By analyzing the relationships between numbers in a sequence, you are exercising your analytical and deductive reasoning skills. This helps you break down complex problems into smaller, more manageable parts.",
    },
    {
      title: "Boosts Numerical Fluency",
      content:
        "Regularly working with number sequences can improve your comfort and speed with mental math, making everyday calculations quicker and easier.",
    },
  ],
  reading: [
    {
      title: "Improves Comprehension and Retention",
      content:
        "This exercise forces you to not just read words, but to understand and retain the meaning behind them. Practicing this skill improves your ability to learn from written materials and recall important details.",
    },
    {
      title: "Expands Vocabulary",
      content:
        "Encountering words in different contexts is one of the best ways to build your vocabulary. A richer vocabulary enhances communication skills and allows for more precise expression of ideas.",
    },
    {
      title: "Sharpens Critical Thinking",
      content:
        "Answering questions about a text requires you to analyze information, make inferences, and evaluate details. This is a core component of critical thinking that helps you better understand the world around you.",
    },
  ],
  speedReading: [
    {
      title: "Increases Reading Speed",
      content:
        "The core benefit is training your brain to process words faster. By reducing subvocalization (the habit of saying words in your head as you read), you can significantly increase your words-per-minute rate.",
    },
    {
      title: "Improves Focus and Concentration",
      content:
        "Speed reading requires intense focus. This exercise trains your brain to maintain concentration for longer periods, helping you stay on task and absorb information more efficiently.",
    },
    {
      title: "Boosts Overall Productivity",
      content:
        "In a world filled with information, being able to read and comprehend text faster is a superpower. It allows you to get through emails, reports, and articles more quickly, freeing up time for other tasks.",
    },
  ],
  riddle: [
    {
        title: "Promotes Lateral Thinking",
        content: "Riddles often require you to think outside the box and approach problems from unconventional angles. This strengthens your ability to find creative solutions to complex challenges."
    },
    {
        title: "Enhances Problem-Solving Abilities",
        content: "Solving a riddle is a fun way to practice problem-solving. You must analyze the information given, identify the core question, and use deduction to arrive at the answer."
    },
    {
        title: "Boosts Language and Comprehension Skills",
        content: "Riddles play with words, metaphors, and double meanings. Engaging with them regularly can improve your understanding of language nuances and enhance your reading comprehension."
    }
  ],
  wordLadder: [
    {
        title: "Expands Vocabulary and Word Association",
        content: "Word ladder puzzles challenge you to think of words that are similar in form but different in meaning. This process strengthens your vocabulary and your brain's ability to form connections between words."
    },
    {
        title: "Improves Step-by-Step Planning",
        content: "Solving a word ladder requires you to plan several steps ahead. You must visualize the path from the start word to the end word, exercising your strategic thinking and planning abilities."
    },
    {
        title: "Enhances Working Memory",
        content: "As you try different letter combinations, you have to hold the target word, the current word, and potential next words in your mind. This is an excellent workout for your working memory."
    }
  ],
};
