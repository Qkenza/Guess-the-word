let UserCards = new Array()
let RobotCards = new Array()
const AvailableCards = [1, 2, 3, 4, 5, 6, 7, 11, 12]

const Card = {
    number: null,
    texture: null,
    effect: null,
}

// const SpecialCards = {
//     card_11: { number: 11, texture: '11.png', effect: choose() },
//     card_7: { number: 7, texture: '7.png', effect: taketwo() },
//     card_6: { number: 6, texture: '6.png', effect: takeone() },
//     card_2: { number: 2, texture: '2.png', effect: pause() },
// }

$(document).ready(function () {
    for (let i = 0; i < 8; i++) {
        newcard = AvailableCards[Math.floor(Math.random() * 9)]
        if (i % 2)
            UserCards.push(newcard)
        else
            RobotCards.push(newcard)
    }
})