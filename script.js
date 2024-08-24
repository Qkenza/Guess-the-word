Request

const boxes = document.querySelectorAll('.box')

let srow = 0;
let erow = 5;
let box = 0;

function check() {
    srow = erow;
    erow = erow + 5;
}

function nonalphabet() {
    alert('Enter Alphabet')
}

document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        check()
    }
    if (event.key === 'Backspace') {
        if (box > srow) {
            box--;
        }
        boxes[box].innerHTML = '';
    } else if (event.key.length === 1 && box < erow) {
        if ((event.key >= 'a' && event.key <= 'z') || (event.key >= 'A' && event.key <= 'Z')) {
            boxes[box].innerHTML = event.key.toUpperCase();
            box++;
        } else {
            nonalphabet();
        }
    }
    if (box === erow) {
        alert('Press Enter')
    }
});