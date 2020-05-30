const highScoresList = document.getElementById("highScoresList");
const highScorers = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScorers
  .map( score => {
    return `<li class="high-score">${score.userName} - ${score.userScore}</li>`
  })
  .join("");