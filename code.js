
const letters = document.querySelectorAll(".box");
const  word_LENGTH = 5

async function init() 
{
  let currentRow = 0;
  let currentGuess = "";

  // fetches the word of the day from an API
  const respond =  await fetch("https://words.dev-apis.com/word-of-the-day");
  const res_obj =  await respond.json(); 
  const word = res_obj.word.toUpperCase();


  //  adds a letter to the current guess
  function addLetter(letter) 
  {
    if (currentGuess.length < word_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * word_LENGTH + currentGuess.length - 1].innerText = letter;
  }

  async function commit(){
    if (currentGuess.length !== word_LENGTH){
      return;
    }

    
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * word_LENGTH + currentGuess.length].innerText = '';
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