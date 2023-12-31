import './style.css'
import { Questions } from './questions'


const app = document.querySelector("#app")

const startButton = document.querySelector("#start")

startButton.addEventListener("click", startQuiz)

function startQuiz(event) {
  let currentQuestion = 0
  let score = 0
  
  
  displayQuestion(currentQuestion)

  function clean() {
    while (app.firstElementChild){
      app.firstElementChild.remove()
      
    }

    
  }

  function displayQuestion(index) {

    clean()
    const question = Questions[index]

    if(!question){
      finishMessage()
      return;
    }
    const scoreAf = scoreAffiche(score, Questions.length)
    app.appendChild(scoreAf)
    
    TimerQuestion(() => {
      currentQuestion++
      displayQuestion(currentQuestion)
    })

    const progress = progressBar(Questions.length, currentQuestion)
    app.appendChild(progress)

    const title = getTitleElement(question.question)
    app.appendChild(title)
    const answersDiv = createAnswers(question.answers)
    app.appendChild(answersDiv)

    const submitButton = getSubmitButton()
    submitButton.addEventListener("click", submit)
    app.appendChild(submitButton)
  }

  function finishMessage() {
    const h2 = document.createElement("h2")
    h2.innerText = "Bravo! T'as terminé l'interrogation"
    const p = document.createElement("p")
    p.innerText =`T'as eu ${score} / ${Questions.length}`

    const button = document.createElement("button");
    button.innerText = "Retour";

    button.addEventListener("click", function() {
      // Rediriger l'utilisateur vers la page d'accueil
      window.location.href = "/quiz-info/";
    })

    app.appendChild(h2)
    app.appendChild(p)
    app.appendChild(button)
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked')

    disableAllReponse()

    const value = selectedAnswer.value
    const question = Questions[currentQuestion]
    const isCorrect = question.correct === value

    if(isCorrect){
      score++
    }
    showFeedback(isCorrect, question.correct, value)

    const feedback = getMessage(isCorrect, question.correct)
    app.appendChild(feedback)

    showNextQuestion()

  }

 

  function createAnswers(answers){
      const answersDiv = document.createElement("div")

      answersDiv.classList.add("answers");

      for (const answer of answers){
        const label = getAnswersElement(answer)
        answersDiv.appendChild(label)
      }

      return answersDiv
  }

}

function showNextQuestion() {
 
  app.querySelector("button").remove()

}

function getTitleElement(text) {
    const title = document.createElement("h3")
    title.innerHTML = text
    return title
}

function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase()
}

function getAnswersElement(text) {
  const label = document.createElement("label")
  label.innerText = text
  const input = document.createElement("input")
  const id = formatId(text)
  input.id = id
  label.htmlFor = id
  input.setAttribute("type", "radio")
  input.setAttribute("name", "answer")
  input.setAttribute("value", text)

  label.appendChild(input)

  return label
}

function getSubmitButton() {
  const submitButton = document.createElement("button")
  submitButton.innerText = "Soumettre"
  return submitButton
}

function showFeedback(isCorrect, correct, answer){
  const correctAnswerId = formatId(correct)
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  )

  const selectedAnswerId = formatId(answer)
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  )

  correctElement.classList.add("correct")
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect")
    
}

function getMessage (isCorrect, correct) {

  const message = document.createElement("message")

  if (isCorrect) {
    createToast("Bravo ! t'as choisie la bonne réponse !", 3000);
  }else {
    createToast(`Désolé... mais la bonne réponse était ${correct}`, 3000);
  }

  return message;
}

function createToast(text, duration) {
  // Créer un élément div pour le toast
  let toast = document.createElement("div");
  toast.classList.add("toast");

  // Ajouter le texte au toast
  let textNode = document.createTextNode(text);
  toast.appendChild(textNode);

  // Afficher le toast
  document.body.appendChild(toast);

  // Masquer le toast après la durée spécifiée
  setTimeout(() => {
    toast.remove();
  }, duration);
}

function progressBar(max, value) {
  const progress = document.createElement("progress")
  progress.setAttribute("max", max)
  progress.setAttribute("value", value)
  return progress
}

function disableAllReponse() {
  const radioInput = document.querySelectorAll('input[type="radio"]')

  for (const radio of radioInput){
    radio.disabled = true
  }
}

function TimerQuestion(callback){
  
  let changeTimer = 10000
  const getBtnText = () => `${changeTimer / 1000}s`
  const h1 = document.createElement("h1")
  h1.innerText = getBtnText()

  app.appendChild(h1)

  const interval = setInterval(() => {
    changeTimer -= 1000
    h1.innerText = getBtnText()
  }, 1000)

  const time = setTimeout(() => {
    handleNextQuestion()
  }, 10000)

  const handleNextQuestion = () => {
    clearInterval(interval)
    clearTimeout(time)
    callback()
  }
  
 
}

function scoreAffiche(s,t) {
  const h4 = document.createElement("h4")
  h4.innerText =`${s} / ${t}`
  return h4
}