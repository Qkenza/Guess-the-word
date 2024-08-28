
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
  const wordLetter = word.split("");


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

    const guessLetter = currentGuess.split("");

    // Finding a correct or close or wrong letter in the  word and applying a visual effect
     for (let i = 0; i < word_LENGTH; i++){
      if (guessLetter[i] === wordLetter[i]){
        letters[currentRow * word_LENGTH + i].classList.add("correct")
      } else if ( wordLetter.includes(guessLetter[i])){
        letters[currentRow * word_LENGTH + i].classList.add("close") 
      } else {
        letters[currentRow * word_LENGTH + i].classList.add("wrong")
      }
    }

    // Increment currentRow to move to the next word after pressing Enter
    currentRow++;
    currentGuess = "";

    
    
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