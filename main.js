let currentQuestionIndex = 0;
let questions = [];

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
      const quizPage = document.getElementById('quiz-page');
      const question = questions[currentQuestionIndex];
  
      quizPage.innerHTML = '';
  
      const answers = shuffleArray(question.incorrect_answers.concat(question.correct_answer));
  
      const questionElement = document.createElement('div');
      questionElement.innerHTML = `
        <h3>Pregunta ${currentQuestionIndex + 1}:</h3>
        <p>${question.question}</p>
        ${answers.map((answer, i) => {

          const colors = ['red', 'blue', 'green', 'yellow'];

          const style = `background-color: ${colors[i]}; color: white;`;
          return `<button class="button" style="${style}" data-answer="${answer}">${answer}</button>`;
        }).join('')}
      `;
  
      quizPage.appendChild(questionElement);
  
      const buttons = questionElement.querySelectorAll('.button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const selectedAnswer = button.getAttribute('data-answer');
          const correctAnswer = question.correct_answer;
          checkAnswer(selectedAnswer, correctAnswer);
        });
      });
    } else {
      showFinalMessage();
    }
  }
  
function checkAnswer(selectedAnswer, correctAnswer) {
  const resultMessage = document.createElement('p');
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

  currentQuestionIndex++;
  setTimeout(renderQuestion, 3000);
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
