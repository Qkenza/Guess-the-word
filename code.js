
const letters = document.querySelectorAll(".box");
const loadingDiv = document.querySelector(".info-bar");


async function init() 
{
  let currentRow = 0;
  let currentGuess = "";


  //  adds a letter to the current guess
  function addLetter(letter) 
  {
    if (currentGuess.length < 5) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * 5 + currentGuess.length - 1].innerText = letter;
  }

  async function commit(){
    if (currentGuess.length === 5){
      return;
    }

    currentRow++;
    currentGuess = "";
  }

 
  
  // listening for event keys and routing to the right function
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


init();