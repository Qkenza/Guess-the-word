
const ROUNDS = 6;
const letters = document.querySelectorAll(".box");
const loadingDiv = document.querySelector(".info-bar");

// I like to do an init function so I can use "await"
async function init() 
{
  // the state for the app
  let currentRow = 0;
  let currentGuess = "";


  // user adds a letter to the current guess
  function addLetter(letter) 
  {
    if (currentGuess.length < 5) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * 5 + currentGuess.length - 1].innerText = letter;
  }

  // use tries to enter a guess
  
  // listening for event keys and routing to the right function
  // we listen on keydown so we can catch Enter and Backspace
  document.addEventListener("keydown", function handleKeyPress(event) {
    

    if (event.key === "Enter") {
      commit();
    } else if (event.key === "Backspace") {
      backspace();
    } else if (isLetter(event.key)) {
      addLetter(event.key.toUpperCase());
    } 
  });
}

// check  if a character is alphabet letter
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}


// takes an array of letters (like ['E', 'L', 'I', 'T', 'E']) and creates
// an object out of it (like {E: 2, L: 1, T: 1}) so we can use that to
// make sure we get the correct amount of letters marked close instead
// of just wrong or correct


init();