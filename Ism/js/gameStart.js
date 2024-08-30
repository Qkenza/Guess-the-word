// start the game
function startGame(apiword) {
    $('#loadingMessage').remove() // remove the loading game message

    // get the word
    guessWord = apiword.word.toUpperCase()
    console.log(guessWord)

    $(document).ready(function () {
        $row = $('#grid-container').children().first();
        $col = $row.children().first(); // Start with the first row and its columns

        $(document).keyup(function (event) {
            if (inputEvent) {
                if (event.key === 'Enter') {
                    validateRow()
                } else if (event.key === 'Backspace') {
                    deleteData()
                } else {
                    addData(event.key.toUpperCase())
                }
            }
        });
    });
}


// display a message over the grid
function displayMessage(text) {
    $('.text__messagebox').text(text).css('display', 'block')
    $('.text__messagebox').delay(1000).fadeOut('slow', 'swing')
}

function validateWord() {
    inputEvent = false;
    return $.ajax({
        url: 'https://words.dev-apis.com/validate-word',
        data: `{ "word": "${userWord.trim()}" }`,
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST'
    })
}

// process the row
async function validateRow() {
    if (userWord.length === 5) {
        try {
            const res = await validateWord()
            if (res.validWord) {
                await animateRow()

                if (userWord === guessWord) {
                    endGame(userWord, guessWord);
                }
                // // Move to the next row if it exists
                if ($row.next().length) {
                    $row = $row.next();
                    $col = $row.children().first(); // Update $col to the new row's children
                } else {
                    endGame(userWord, guessWord);
                }
                userWord = ''
            } else {
                displayMessage('NOT A VALID WORD')
            }
        } catch (err) {
            console.log(err)
        }
    } else {
        displayMessage('TOO SHORT')
    }
    inputEvent = true
}

// add character to the Row
function addData(key) {
    if (isLetter(key)) {
        userWord.length < 5 ? userWord += key : userWord = userWord.slice(0, -1) + key

        const $currentCol = $col
        $currentCol.text(key)
        $currentCol.addClass('columns--active').delay(bounceAnim).queue((next) => {
            $currentCol.removeClass('columns--active')
            next();
        })

        if ($col.next().length) {
            $col = $col.next()
        }
    }
}

// delete current character from the Row
function deleteData() {
    userWord = userWord.slice(0, -1)
    if ($col.text() !== '') {
        $col.text('')
    }
    else {
        if ($col.prev().length)
            $col = $col.prev()
        $col.text('')
    }
}

// end the Game
function endGame(userWord, guessWord) {
    if (userWord === guessWord) {
        setTimeout(displayMessage('YOU WIN'), doneDelay)
    } else {
        setTimeout(displayMessage('GAME OVER'), doneDelay)
    }
    $(document).off('keyup');
    $('.keyboard').remove()
}
