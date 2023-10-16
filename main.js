const homeNav = document.getElementById("homeNav");
const resultsNav = document.getElementById("resultsNav");
const homeDiv = document.getElementById("home");
const resultsDiv = document.getElementById("results");
const gifsDiv = document.getElementById("gifsDiv")
const quizPage = document.getElementById('quiz-page');

let questionCounter = 0;
let questions = [];
let resultMessage = null;
let isRenderingNextQuestion = false;
let correctAnswersCount = 0;

const savedProgress = localStorage.getItem('quizProgress');
if (savedProgress) {
    questionCounter = parseInt(savedProgress, 10);
}

function printChart() {
    const labels = ['Correctas', 'Incorrectas'];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Results',
      backgroundColor: "rgba(255,99,132,0.2)",
    borderColor: "rgba(255,99,132,1)",
    borderWidth: 2,
    hoverBackgroundColor: "rgba(255,99,132,0.4)",
    hoverBorderColor: "rgba(255,99,132,1)",
      data: [correctAnswersCount, 10-correctAnswersCount],
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {}
  };

const myChart = new Chart('myChart', config);
}
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

function goHome() {
    homeDiv.classList.remove("hide");
    resultsDiv.classList.add("hide");
    quizPage.classList.remove("hide")
    gifsDiv.innerHTML=""
    questionCounter = 0;
    getQuestions()
}

function goResults() {
    homeDiv.classList.add("hide");
    resultsDiv.classList.remove("hide");
    quizPage.classList.add("hide")
    gifsDiv.innerHTML=""
    printChart()
    
}

function renderNextQuestion() {
    if (isRenderingNextQuestion) {
        return;
    }

    isRenderingNextQuestion = true;

    setTimeout(() => {
        isRenderingNextQuestion = false;
    }, 1000);

    questionCounter++;

    if (questionCounter < questions.length) {
        renderQuestion();
    } else {
        showFinalMessage();
    }
}

function renderQuestion() {
    if (questionCounter < questions.length) {
        const question = questions[questionCounter];

        const questionHeading = document.getElementById('question-heading');
        const questionText = document.getElementById('question-text');
        const answerButtons = document.querySelectorAll('#answer-buttons .button');

        questionHeading.textContent = `Question ${questionCounter + 1}:`;
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

        localStorage.removeItem('quizProgress');
    }
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (resultMessage) {
        resultMessage.remove();
    }

    resultMessage = document.createElement('p');
    if (selectedAnswer === correctAnswer) {
        resultMessage.textContent = "Congratulations! The answer is correct.";
        resultMessage.style.color = 'green';
        correctAnswersCount++;
    } else {
        resultMessage.textContent = "I'm sorry, incorrect answer.";
        resultMessage.style.color = 'red';
    }


    quizPage.appendChild(resultMessage);

    const buttons = quizPage.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });

    setTimeout(() => {
        renderNextQuestion();
    }, 1000);
}


function showFinalMessage() {
    quizPage.classList.add("hide")
    if (correctAnswersCount >= 5) {
        gifsDiv.innerHTML = '<h3>¡Congratulations, you have completed The Big Quiz!!</h3><img src="/assets/funny-celebrate-12.gif">';
    } else {
        gifsDiv.innerHTML = '<h3>¡What a pity, we will have to study more!!</h3><img src="/assets/triste-tristeza.gif">';
    }

    localStorage.removeItem('quizProgress');
        setTimeout(() => {
        goResults()
    }, 2000);
    homeNav.addEventListener("click", goHome);

}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
getQuestions();
resultsNav.addEventListener("click", goResults);
homeNav.addEventListener("click", goHome);
