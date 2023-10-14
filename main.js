let currentQuestionIndex = 0;
let questions = [];
let resultMessage = null;

function getQuestions() {
  axios.get('https://opentdb.com/api.php?amount=10&type=multiple')
    .then(res => {
      const data = res.data;
      questions = data.results;
      renderQuestion();
    })
    .catch(error => {
      console.error(error);
    });
}

function renderQuestion() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];

    const questionHeading = document.getElementById('question-heading');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.querySelectorAll('#answer-buttons .button');

    questionHeading.textContent = `Pregunta ${currentQuestionIndex + 1}:`;
    questionText.textContent = question.question;

    const answers = shuffleArray(question.incorrect_answers.concat(question.correct_answer));

    answerButtons.forEach((button, i) => {
      button.textContent = answers[i];
      button.removeAttribute('disabled');
      button.setAttribute('data-answer', answers[i]);

      button.addEventListener('click', () => {
        const selectedAnswer = button.getAttribute('data-answer');
        const correctAnswer = question.correct_answer;
        checkAnswer(selectedAnswer, correctAnswer);
      });
    });

    if (resultMessage) {
      resultMessage.remove();
    }
  } else {
    showFinalMessage();
  }
}

function checkAnswer(selectedAnswer, correctAnswer) {
  if (resultMessage) {
    resultMessage.remove();
  }

  resultMessage = document.createElement('p');
  if (selectedAnswer === correctAnswer) {
    resultMessage.textContent = '¡Felicitaciones! La respuesta es correcta.';
    resultMessage.style.color = 'green';
  } else {
    resultMessage.textContent = 'Ánimo, la respuesta es incorrecta.';
    resultMessage.style.color = 'red';
  }

  const quizPage = document.getElementById('quiz-page');

  quizPage.appendChild(resultMessage);

  const buttons = quizPage.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
  });

  setTimeout(() => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      showFinalMessage();
    }
  }, 3000);
}


function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function showFinalMessage() {
  const quizPage = document.getElementById('quiz-page');
  quizPage.innerHTML = '<h3>¡Felicidades, has completado el cuestionario!</h3>';
}

document.addEventListener('DOMContentLoaded', getQuestions);
