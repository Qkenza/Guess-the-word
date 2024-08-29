
$(document).ready(function () {
    Keyboard.init();
    for (let r = 0; r < 6; r++) {
        const $row = $('<div>', { id: `row-${r + 1}`, class: 'rows' }).appendTo('#grid-container');
        for (let c = 0; c < 5; c++) {
            $('<div>', { id: `col-${c + 1}`, class: 'columns' }).appendTo($row)
        }
    }
    $.ajax({
        url: 'https://words.dev-apis.com/word-of-the-day',
        beforeSend: loadingGame,
        success: gameStart,
        error: APIError,
        dataType: 'json',
        type: 'GET'
    })
})




function loadingGame() {
    $('<div>', { id: 'loadingMessage', class: 'textMessage', text: 'loading...' }).appendTo('body')
}

function APIError(error) {
    console.log('Seer tn3ess', error);
}

function isLetter(c) {
    return /^[a-zA-Z]$/.test(c)
}