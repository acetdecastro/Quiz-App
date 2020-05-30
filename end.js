const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORERS = 5;

finalScore.innerText = mostRecentScore

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = ! username.value;
});

saveHighScore = e => {
  e.preventDefault();

  const score = {
    userScore: mostRecentScore,
    userName: username.value
  }

  highScores.push(score);
  highScores.sort( (a,b) => b.userScore - a.userScore);
  highScores.splice(MAX_HIGH_SCORERS);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  
  window.location.assign("/");
};