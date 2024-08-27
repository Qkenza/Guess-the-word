
const letters = document.querySelectorAll(".letter");


async function init() 
{
  let currentRow = 0;
  let currentGuess = "";
  let done = false;
  let isLoading = true;

  // nab the word 
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const { word: wordRes } = await res.json();
  const word = wordRes.toUpperCase();
  const wordParts = word.split("");
  isLoading = false;

  // user adds a letter to the current guess
  function addLetter(letter) 
  {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText = letter;
  }

  async function commit() {

    // check the API to see if has a valid word
    isLoading = true;
    
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const { validWord } = await res.json();
    isLoading = false;

    const guessParts = currentGuess.split("");


    //  finds correct letters 
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
      }
    }
    }

    currentRow++;
    currentGuess = "";
    
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
  }

 

  // Listens for keydown events and dispatches actions based on the pressed key.
  // Ignores events if the task is complete or currently loading
  document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
      // do nothing;
      return;
    }

    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } 
  });


// check  if a character is alphabet letter
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}


init();