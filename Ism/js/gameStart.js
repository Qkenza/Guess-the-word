let flipTime = 300;
let doneDelay = flipTime + 200;


function gameStart(guessWord) {
    $('#loadingMessage').remove()
    guessWord = guessWord.word.toUpperCase()
    console.log(guessWord)

    function displayMessage(text) {
        $('.text__messagebox').text(text).css('display', 'block')
        $('.text__messagebox').delay(1000).fadeOut('slow', 'swing')
    }
    function animateWordFill($col, key) {
        $col.css('scale', 2).delay(100).queue(function (next) {
            $col.css('scale', 1);
            next();
        })
        $col.text(key.toUpperCase());
    }

    async function animateRow($row) {
        userWord = '';
        let index = 0;
        let delayTime = 0; // Consistent delay between each item

        for (const element of $row.children()) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    if ($(element).text() === guessWord[index++]) {
                        $(element).addClass('animation green');
                    } else if (guessWord.includes($(element).text())) {
                        $(element).addClass('animation yellow');
                    } else {
                        $(element).addClass('animation gray');
                    }
                    userWord += $(element).text();
                    resolve(); // Resolve the promise to continue to the next iteration
                }, delayTime);
                delayTime = flipTime;
            });
        }

        if (userWord === guessWord || $row[0] === $('#grid-container').children().last()[0]) {
            endGame(userWord, guessWord);
        }
    }




    function processData($row, $col) {
        if ($col.last().text().length) {
            animateRow($row.first())

            // // Move to the next row if it exists
            let $nextRow = $row.next();
            if ($nextRow.length) {
                $row = $nextRow;
                $col = $row.first().children(); // Update $col to the new row's children
            }
        } else {
            displayMessage('TOO SHORT')
        }
        return [$row, $col]
    }

    function addData(key, $col) {
        if (isLetter(key)) {
            // Update the text of the current column
            animateWordFill($col.first(), key)
            // Move to the next column if it exists
            let $nextCol = $col.next();
            if ($nextCol.length) {
                $col = $nextCol;
            }
        }
        return $col
    }

    function deleteColumn($col) {
        // Move to the previous column if it exists
        if ($col.text() !== '') {
            $col.text('');
        } else {
            let $prevCol = $col.prev();
            if ($prevCol.length) {
                $prevCol.text(''); // Clear the text of the current column
                $col = $prevCol;
            }
        }
        return $col
    }

    function endGame(userWord, guessWord) {
        if (userWord === guessWord) {
            setTimeout(displayMessage('YOU WIN'), doneDelay)
        } else {
            setTimeout(displayMessage('GAME OVER'), doneDelay)
        }
        $(document).off('keyup');
        $('.keyboard').remove()
    }
    $(document).ready(function () {
        let $row = $('#grid-container').children();
        let $col = $row.first().children(); // Start with the first row and its columns

        $(document).keyup(function (event) {
            if (event.key === 'Enter') {
                [$row, $col] = processData($row, $col)
            } else if (event.key === 'Backspace') {
                $col = deleteColumn($col)
            } else {
                $col = addData(event.key, $col)
            }
        });

        $('.keyboard__keys').children().each(function () {
            $(this).click(() => {
                if ($(this).text() === 'ENTER') {
                    [$row, $col] = processData($row, $col)
                } else if ($(this).text() === 'BACKSPACE') {
                    $col = deleteColumn($col)
                } else {
                    $col = addData($(this).text(), $col)
                }
            })
        })

    });
}
