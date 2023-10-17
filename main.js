const homeNav = document.getElementById("homeNav");
const resultsNav = document.getElementById("resultsNav");
const homeDiv = document.getElementById("home");
const resultsDiv = document.getElementById("results");
const gifsDiv = document.getElementById("gifsDiv")
const quizPage = document.getElementById('quiz-page');
const startBtn = document.getElementById("start-button")


let questionCounter = 0;
let questions = [];
let resultMessage = null;
let isRenderingNextQuestion = false;
let correctAnswersCount = 0;
let myChart;

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

myChart = new Chart('myChart', config);
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
    quizPage.classList.remove("hide");
    gifsDiv.innerHTML=""
    questionCounter = 0;
    getQuestions()
}

function goStart() {
    homeDiv.classList.add("hide");
    resultsDiv.classList.add("hide");
    quizPage.classList.add("hide");
    homeNav.classList.add("hide");
    startBtn.classList.remove("hide");
    ratingButton.classList.add("hide")
    gifsDiv.innerHTML = "";
    questionCounter = 0;
    correctAnswersCount = 0;
    questions = [];
    myChart.destroy()
    getQuestions();
}

function goResults() {
    homeDiv.classList.add("hide");
    resultsDiv.classList.remove("hide");
    quizPage.classList.add("hide");
    ratingButton.classList.remove("hide")

    gifsDiv.innerHTML = "";

    printChart();

    setTimeout(() => {
        let username = prompt("Enter your username:");
        if (username !== null) {
            const userScore = {
                username: username,
                score: correctAnswersCount
            };
            saveUsernameAndScore(userScore);
        }
    }, 1500);

    homeNav.classList.remove("hide");
}


function saveUsernameAndScore(userScore) {
    let userScores = JSON.parse(localStorage.getItem('userScores')) || [];
    userScores.push(userScore);
    localStorage.setItem('userScores', JSON.stringify(userScores));
}

const ratingButton = document.getElementById("rating-button");
ratingButton.addEventListener("click", showRating);

function showRating() {

    homeDiv.classList.add("hide");
    resultsDiv.classList.add("hide");
    quizPage.classList.add("hide");
    homeNav.classList.remove("hide");
    startBtn.classList.add("hide");
    ratingButton.classList.remove("hide")
    
    gifsDiv.innerHTML = "";

    const userScores = JSON.parse(localStorage.getItem('userScores')) || [];

    userScores.sort((a, b) => b.score - a.score);

    const ratingList = document.createElement('ul');
    ratingList.classList.add("rating-list"); // Agregar una clase para el estilo

    const top10Scores = userScores.slice(0, 5);

    for (let i = 0; i < top10Scores.length; i++) {
        const userScore = top10Scores[i];
        const listItem = document.createElement('li');
        listItem.classList.add("rating-item"); // Agregar una clase para el estilo

        listItem.textContent = `${userScore.username}: ${userScore.score}`;
        ratingList.appendChild(listItem);
    }

    gifsDiv.innerHTML = "";
    gifsDiv.appendChild(ratingList);
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

    }
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (resultMessage) {
        resultMessage.remove();
    }

    resultMessage = document.createElement('p');
    if (selectedAnswer === correctAnswer) {
        resultMessage.textContent = "Congratulations! The answer is correct.";
        resultMessage.style.color = "#598876";
        correctAnswersCount++;
    } else {
        resultMessage.textContent = "I'm sorry, incorrect answer.";
        resultMessage.style.color = "#E06D61";
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
        gifsDiv.innerHTML = '<h3>¡Congratulations, you have completed The Big Quiz!!</h3><img src="/assets/cerebro_ok.png">';
    } else {
        gifsDiv.innerHTML = '<h3>¡Your brain is messed up but you can play again!!</h3><img src="/assets/cerebro_nok.png">';
    }
        setTimeout(() => {
        goResults()
    }, 2000);

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
// resultsNav.addEventListener("click", goResults);
homeNav.addEventListener("click", goStart);
startBtn.addEventListener("click",() => {
startBtn.classList.add("hide")
    goHome()
})