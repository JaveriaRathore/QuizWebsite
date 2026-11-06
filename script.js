const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answer: 1,
    explanation: "Mars looks reddish because iron minerals in its soil have oxidized, or rusted."
  },
  {
    question: "Which language is primarily used to structure a web page?",
    options: ["CSS", "Python", "HTML", "SQL"],
    answer: 2,
    explanation: "HTML defines the structure and content of a web page."
  },
  {
    question: "What is the capital city of Japan?",
    options: ["Seoul", "Beijing", "Bangkok", "Tokyo"],
    answer: 3,
    explanation: "Tokyo is the capital of Japan."
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["Five", "Six", "Seven", "Eight"],
    answer: 1,
    explanation: "A hexagon is a polygon with six sides."
  },
  {
    question: "Which part of a computer is often called its 'brain'?",
    options: ["CPU", "Monitor", "Keyboard", "Mouse"],
    answer: 0,
    explanation: "The CPU executes instructions and processes data."
  }
];

const intro = document.getElementById("intro");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");
const questionsContainer = document.getElementById("questionsContainer");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");
const answeredCount = document.getElementById("answeredCount");
const formMessage = document.getElementById("formMessage");
const progressFill = document.getElementById("progressFill");
const questionCount = document.getElementById("questionCount");

let submitted = false;

function renderQuestions() {
  questionsContainer.innerHTML = questions.map((item, index) => `
    <fieldset class="question-block">
      <legend class="question-title"><span class="q-number">${String(index + 1).padStart(2, "0")}</span>${item.question}</legend>
      <div class="options">
        ${item.options.map((option, optionIndex) => `
          <label class="option">
            <input type="radio" name="question-${index}" value="${optionIndex}">
            <span>${option}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");
  questionsContainer.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener("change", updateProgress);
  });
  updateProgress();
}

function updateProgress() {
  const answered = questions.filter((_, index) =>
    questionsContainer.querySelector(`input[name="question-${index}"]:checked`)
  ).length;
  answeredCount.textContent = `${answered} of ${questions.length} answered`;
  progressFill.style.width = `${(answered / questions.length) * 100}%`;
  questionCount.textContent = `QUESTION ${Math.min(answered + 1, questions.length)} / ${questions.length}`;
}

function startQuiz() {
  submitted = false;
  intro.classList.add("hidden");
  resultSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit answers →";
  formMessage.textContent = "";
  renderQuestions();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function submitQuiz() {
  // Guard against repeated submissions; score can only be calculated once per attempt.
  if (submitted) return;

  const answers = questions.map((_, index) =>
    questionsContainer.querySelector(`input[name="question-${index}"]:checked`)
  );

  const unanswered = answers.filter(answer => !answer).length;
  if (unanswered > 0) {
    formMessage.textContent = `Please answer all ${questions.length} questions before submitting. ${unanswered} remaining.`;
    const firstMissing = answers.findIndex(answer => !answer);
    const missingBlock = questionsContainer.querySelectorAll(".question-block")[firstMissing];
    missingBlock?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  submitted = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitted ✓";

  const selectedAnswers = answers.map(answer => Number(answer.value));
  const correct = questions.reduce((total, item, index) =>
    total + (selectedAnswers[index] === item.answer ? 1 : 0), 0
  );
  showResults(selectedAnswers, correct);
}

function showResults(selectedAnswers, correct) {
  const incorrect = questions.length - correct;
  const percentage = Math.round((correct / questions.length) * 100);

  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  document.getElementById("scoreValue").textContent = `${correct}/${questions.length}`;
  document.getElementById("correctValue").textContent = correct;
  document.getElementById("incorrectValue").textContent = incorrect;
  document.getElementById("percentValue").textContent = `${percentage}%`;
  document.getElementById("resultHeading").textContent =
    percentage === 100 ? "Perfect score!" : percentage >= 60 ? "Well done!" : "Keep practicing!";
  document.getElementById("resultCopy").textContent =
    percentage === 100 ? "You answered every question correctly." :
    percentage >= 60 ? "You have a good grasp of these topics. Review any missed answers below." :
    "Every attempt is a chance to learn. Review the answers and try again.";
  document.getElementById("resultIcon").textContent = percentage >= 60 ? "✓" : "↗";
  document.querySelector(".score-ring").style.setProperty("--score", `${percentage}%`);

  document.getElementById("reviewList").innerHTML = questions.map((item, index) => {
    const isCorrect = selectedAnswers[index] === item.answer;
    return `<div class="review-item">
      <strong>${index + 1}. ${item.question}</strong>
      <span class="${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Correct" : "Incorrect"} — Your answer: ${item.options[selectedAnswers[index]]}</span>
      ${isCorrect ? "" : `<div>Correct answer: <b>${item.options[item.answer]}</b></div>`}
      <div>${item.explanation}</div>
    </div>`;
  }).join("");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function restartQuiz() {
  submitted = false;
  resultSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  intro.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", submitQuiz);
restartBtn.addEventListener("click", startQuiz);
