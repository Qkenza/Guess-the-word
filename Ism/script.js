$.ajax({
    url: 'https://words.dev-apis.com/word-of-the-day',
    beforeSend: loadingGame,
    success: gameStart,
    error: APIError,
    dataType: 'json',
    type: 'GET'
})

function loadingGame() {
    console.log('the game is loading');
}

function APIError(error) {
    console.log('Seer tn3ess', error);
}



function gameStart(guessWord) {
    guessWord = guessWord.word
    console.log(guessWord)
    $('#headerLine').text('GUESS THE WORD');
    createGameBox();


    function createGameBox() {
        for (let r = 0; r < 6; r++) {
            const $row = $('<div>', { id: `row-${r + 1}`, class: 'rows' }).appendTo('#grid-container');
            for (let c = 0; c < 5; c++) {
                $('<div>', { id: `col-${c + 1}`, class: 'columns' }).appendTo($row)
            }
        }
    }

    function animate_row($row) {
        $row.children().each(function () {
            $(this).css('backgound-color: red')
        })
    }

    function check($row) {
        let userWord = '';
        let emptyFound = false;

        $row.children().each(function () {
            if ($(this).text() === '') {
                let $emptyLine = $('<div>', { id: 'emptyLine', text: 'Fill the whole line Boy!!!!' }).appendTo('body');
                $emptyLine.css('opacity', 0).show().animate({ opacity: 1 }, 1000); // Fade in over 1 second

                setTimeout(function () {
                    $emptyLine.animate({ opacity: 0 }, 1000, function () { // Fade out over 1 second
                        $(this).remove(); // Remove the element from the DOM
                    });
                }, 10000); // Wait 10 seconds before starting the fade-out

                userWord = null;
                emptyFound = true;
                return false; // Stop the loop
            }
            userWord += $(this).text();
        });
        if (!emptyFound) {
            animate_row($row)
        }
        return emptyFound ? false : userWord;
    }

    $(document).ready(function () {
        let $row = $('#grid-container').children();
        let $col = $row.first().children(); // Start with the first row and its columns

        $(document).keyup(function (event) {
            if (event.key === 'Enter') {
                if (check($($row[0])) === false) {
                    return false; // Stop further processing
                }
                // Move to the next row if it exists
                let $nextRow = $row.next();
                if ($nextRow.length) {
                    $row = $nextRow;
                    $col = $row.children(); // Update $col to the new row's children
                }
            } else if (event.key === 'Backspace') {
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
            } else {
                // Update the text of the current column
                $col.first().text(event.key.toUpperCase());
                // Move to the next column if it exists
                let $nextCol = $col.next();
                if ($nextCol.length) {
                    $col = $nextCol;
                }
            }
        });
    });

}