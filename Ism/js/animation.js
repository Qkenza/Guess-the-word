// animate the whole row
async function animateRow() {
    let index = 0;

    for (const element of $row.children()) {
        await new Promise((resolve) => {
            setTimeout(() => {
                if ($(element).text() === guessWord.charAt(index++))
                    $(element).addClass('animation green')
                else if (guessWord.includes($(element).text()))
                    $(element).addClass('animation yellow')
                else
                    $(element).addClass('animation gray');
                resolve();
            }, flipTime)
        })

    }
}
