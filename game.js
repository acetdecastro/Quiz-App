const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressBarText = document.getElementById("progressBarText");
const progressBar = document.getElementById("progressBar");
const scoreText = document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let questions = [];
let availableQuestions = [];

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
  .then( res => {
    return res.json();
  })
  .then( loadedQuestions => {
    questions = loadedQuestions.results.map( loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer)

      answerChoices.forEach( (choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch( err => {
    console.error(err);
  });

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();

  loader.classList.add("hidden");
  game.classList.remove("hidden");
};

getNewQuestion = () => {
  // Redirectes to end page if there are no more available questions or user hit max questions
  if (availableQuestions.length === 0 ||
      questionCounter > MAX_QUESTIONS - 1
    ) {
    console.log("hello")
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }

  questionCounter++;
  progressBarText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach( choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number]
  });

  removeDisplayedQuestionFromAvailableQuestions(questionIndex);

  acceptingAnswers = true;
};

checkAvailableQuestionsLength = () => {
  if (availableQuestions.length === 0 ||
      questionCounter > MAX_QUESTIONS
    ) {
    return window.location.assign("/end.html");
  }
};

removeDisplayedQuestionFromAvailableQuestions = questionIndex => {
  availableQuestions.splice(questionIndex, 1);
};

// Add click event listener to choices
choices.forEach( choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) {
      return
    }

    // Delay
    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = Number(selectedChoice.dataset["number"]);

    validateSelectedAnswer(selectedChoice, selectedAnswer);

    progressBar.style.width = `${(questionCounter / MAX_QUESTIONS * 100)}%`
  });
});

validateSelectedAnswer = (selectedChoice, selectedAnswer) => {
  let classToApply = "incorrect";

  if (selectedAnswer === currentQuestion.answer) {
    classToApply = "correct";
    incrementScore(CORRECT_BONUS);
  }

  selectedChoice.parentElement.classList.add(classToApply);

  setTimeout(() => {
    selectedChoice.parentElement.classList.remove(classToApply);
    getNewQuestion();
  }, 500);
};

incrementScore = points => {
  score += points;
  scoreText.innerText = score;
};