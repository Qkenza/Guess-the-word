let flipTime = $(':root').css('--flip__delay');
let doneDelay = flipTime + 200;
let bounceAnim = $(':root').css('--bounce__delay')

let inputEvent = true
let userWord = '';
let guessWord = '';
let $row = null;
let $col = null;

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
        success: startGame,
        error: APIError,
        dataType: 'json',
        type: 'GET'
    })
})




function loadingGame() {
    $('<div>', { id: 'loadingMessage', class: 'text__messagebox', text: 'loading...' }).prependTo('#game')
}

function APIError(error) {
    console.log('Seer tn3ess', error);
}

function isLetter(c) {
    return /^[a-zA-Z]$/.test(c)
}