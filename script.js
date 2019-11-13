let tableau = [[], [], [], [], [], [], []];
let foundation = [[], [], [], []];

let suites = ['H', 'D', 'C', 'S'],
    deckCards = [],
    wastePile = [];

CreateDeck();
DealDeck();
DisplayDeck();

function CreateDeck() {
    // 1 represents 10, because each card is represented by 2 digits: AH or 9S for instance
    suites.forEach(function (suite) {
        deckCards.push('A' + suite);
        for (let i = 1; i <= 9; i++) {
            deckCards.push(i + suite);
        }
        deckCards.push('J' + suite);
        deckCards.push('Q' + suite);
        deckCards.push('K' + suite);
    });

    // shuffle the deck
    for (let i = deckCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = deckCards[i];
        deckCards[i] = deckCards[j];
        deckCards[j] = temp;
    };
}

function DealDeck() {

    for (let i = 0; i < 7; i++) {

        for (let j = i; j < 7; j++) {

            tableau[j].push(deckCards.pop());
        }
    }

}

function DisplayDeck() {

    for (let i = 1; i <= 7; i++) {

        let counter = 1;

        tableau[i - 1].forEach(function (card) {

            if (counter == tableau[i - 1].length) {
                DisplayCard(card, "p" + i, counter, true);
            } else {
                DisplayCard("red_back", "p" + i, counter, false);
            }
            counter++;
        })
    }

}

function CheckCard(src, elementID) {
    let card = src.slice(-6, -4);
    let matchFound = false;
    // convert card from img format 10* to data format 1*
    if (card[0] == 0) {
        card = 1 + card[1];
    }
    if (card[0] == 'A') {
        switch (card[1]) {
            case 'H':
                foundation[0].push(card);
                PilePop(elementID);
                DisplayCard(card, "hearts", 0, false);
                break;
            case 'D':
                foundation[1].push(card);
                PilePop(elementID);
                DisplayCard(card, "diamonds", 0, false);
                break;
            case 'C':
                foundation[2].push(card);
                PilePop(elementID);
                DisplayCard(card, "clubs", 0, false);
                break;
            case 'S':
                foundation[3].push(card);
                PilePop(elementID);
                DisplayCard(card, "spades", 0, false);
                break;
        }
    } else {
        if (elementID == "hearts" || elementID == "diamonds" || elementID == "clubs" || elementID == "spades") {
            // skip looking at foundation piles, because card is on top of one of them

        } else {
            // compare card with top card of each foundation pile
            for (var i = 0; i < 4; i++) {
                if (foundation[i].length == 0) {

                } else {
                    let topOfPile = foundation[i][foundation[i].length - 1];

                    if (CompareCards(topOfPile, card) == -1) {
                        // if there are any other cards on top of this one, don't send it to the foundation
                        if (elementID != "waste" && tableau[elementID[1] - 1].indexOf(card) != tableau[elementID[1] - 1].length - 1) {
                            break;
                        }
                        matchFound = true;
                        foundation[i].push(card);

                        switch (card[1]) {
                            case 'H':
                                DisplayCard(card, "hearts", 0, false);
                                break;
                            case 'D':
                                DisplayCard(card, "diamonds", 0, false);
                                break;
                            case 'C':
                                DisplayCard(card, "clubs", 0, false);
                                break;
                            case 'S':
                                DisplayCard(card, "spades", 0, false);
                                break;
                        }
                        PilePop(elementID);
                    }
                }
            }
        }

        // compare card with bottom card of each tableau pile
        for (var i = 0; i < 7; i++) {
            if (matchFound) {
                break;
            }

            let topOfPile = tableau[i][tableau[i].length - 1];

            // check to see if card can go on top of pile, or the pile is empty and a King can go there
            if (CompareCards(topOfPile, card) == 1 || (tableau[i].length == 0 && card[0] == 'K')) {

                // see if there are any cards on top of this one
                if (elementID != "waste" && elementID != "hearts" && elementID != "diamonds" && elementID != "clubs" && elementID != "spades" && tableau[elementID[1] - 1].indexOf(card) != tableau[elementID[1] - 1].length - 1) {
                    let cardsOnTop = tableau[elementID[1] - 1].slice(tableau[elementID[1] - 1].indexOf(card));
                    let innerHTML = document.getElementById(elementID).innerHTML;
                    let counter = 1;

                    // remove cards from both old graphic pile and array, place them on new graphic pile
                    // but first make original top card of new pile undroppable before it is buried
                    if (topOfPile == undefined) {

                    } else {
                        let oldTopCardNewPile = document.getElementById("p" + (i + 1)).innerHTML.slice(0, -83);
                        document.getElementById("p" + (i + 1)).innerHTML = oldTopCardNewPile + ">";
                    }
                    cardsOnTop.forEach(function (card) {
                        tableau[elementID[1] - 1].pop();
                        innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf("<"));
                        DisplayCard(card, "p" + (i + 1), tableau[i].length + counter, false);
                        counter++;
                    })
                    document.getElementById(elementID).innerHTML = innerHTML;

                    // and make new top card of new pile droppable
                    let newTopCardNewPile = document.getElementById("p" + (i + 1)).innerHTML.slice(0, -1);
                    document.getElementById("p" + (i + 1)).innerHTML = newTopCardNewPile + " ondrop=\"drop(event,this.parentElement.id,this.src)\" ondragover=\"allowDrop(event)\">";

                    // add cards from old pile to new pile array, remove them visually from old pile
                    tableau[i] = tableau[i].concat(cardsOnTop);

                    // turn up face-down card of old pile
                    // look for 'r', beginning letter of "red_back" in img element, replace a red_back card graphic with face-up card
                    if (innerHTML[innerHTML.lastIndexOf("/") + 1] == 'r') {
                        document.getElementById(elementID).innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf("red_back") - 17);
                        let card = tableau[elementID[1] - 1][tableau[elementID[1] - 1].length - 1];
                        DisplayCard(card, elementID, tableau[elementID[1] - 1].length, true);
                    }

                } else {
                    tableau[i].push(card);
                    PilePop(elementID);
                    let innerHTML = document.getElementById("p" + (i + 1)).innerHTML;
                    if (topOfPile == undefined) {
                        DisplayCard(card, "p" + (i + 1), tableau[i].length, true);
                    } else {
                        document.getElementById("p" + (i + 1)).innerHTML = innerHTML.slice(0, -83) + ">";
                        DisplayCard(card, "p" + (i + 1), tableau[i].length, true);
                    }
                }

                break;
            }
        }
    }

    // check win condition
    if (foundation[0].length == 13 && foundation[1].length == 13 && foundation[2].length == 13 && foundation[3].length == 13) {
        document.getElementById("winbanner").style.display = "block";
    }
}

function PilePop(pile) {
    let innerHTML = "",
        cardNumber = "";

    if (pile == "waste") {
        wastePile.pop();
        let topOfWastePile = wastePile[wastePile.length - 1];

        if (wastePile.length == 0) {
            DisplayCard("yellow_back", "waste", 0, false);
        } else {
            DisplayCard(topOfWastePile, pile, 0, false);
        }
    } else {
        if (pile == "hearts" || pile == "diamonds" || pile == "clubs" || pile == "spades") {

            switch (pile) {
                case "hearts":
                    foundation[0].pop();
                    DisplayCard(foundation[0][foundation[0].length - 1], pile, 0, false);
                    break;
                case "diamonds":
                    foundation[1].pop();
                    DisplayCard(foundation[1][foundation[1].length - 1], pile, 0, false);
                    break;
                case "clubs":
                    foundation[2].pop();
                    DisplayCard(foundation[2][foundation[2].length - 1], pile, 0, false);
                    break;
                case "spades":
                    foundation[3].pop();
                    DisplayCard(foundation[3][foundation[3].length - 1], pile, 0, false);
                    break;
            }

        } else {
            pile = pile[1] - 1;

            if (tableau[pile].length == 1) {
                tableau[pile].pop();
                document.getElementById("p" + (pile + 1)).innerHTML = "";
            } else {
                innerHTML = document.getElementById("p" + (pile + 1)).innerHTML;

                if (innerHTML == undefined) {

                } else {
                    tableau[pile].pop();
                    cardNumber = tableau[pile].length;
                    let card = tableau[pile][tableau[pile].length - 1];

                    // take top card graphic off the pile
                    innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf("<"));
                    document.getElementById("p" + (pile + 1)).innerHTML = innerHTML;

                    // check if the card behind it is face-down, if not make face-up card droppable 
                    if (innerHTML[innerHTML.length - 28] == 'r') {

                        // if it is, remove face-down image and replace it with face-up card
                        document.getElementById("p" + (pile + 1)).innerHTML = innerHTML.slice(0, -45);
                        DisplayCard(card, "p" + (pile + 1), cardNumber, true);
                    } else {
                        innerHTML = innerHTML.slice(0, -1);
                        document.getElementById("p" + (pile + 1)).innerHTML = innerHTML + " ondrop=\"drop(event,this.parentElement.id,this.src)\" ondragover=\"allowDrop(event)\">";
                    }

                }
            }
        }

    }

}

function AdvanceDeck() {

    if (deckCards.length == 0) {
        let wastePileLength = wastePile.length;
        for (let i = 0; i < wastePileLength; i++) {
            deckCards.push(wastePile.pop());
        }
    }
    let newCard = deckCards.pop();
    wastePile.push(newCard);
    DisplayCard(newCard, "waste", 0, false);
};

// if c1 < c2 return -1, if c1 > c2 and is a "match" return 1, else return 0
function CompareCards(c1, c2) {
    if (c1 == undefined) {
        return 0;
    }
    let c1suite = c1[1],
        c2suite = c2[1],
        c1value = c1[0],
        c2value = c2[0];

    // if both suites are the same see if card can go to foundation, if they aren't see if card can go to tableau
    if (c1suite == c2suite) {
        // see if both card values are numbers, if not compare face cards
        if (!isNaN(c1value) && !isNaN(c2value)) {
            if (c2value - c1value == 1) {
                return -1;
            } else if (c1value == 9 && c2value == 1) {
                return -1;
            } else {
                return 0;
            }
        } else if (c1value == "A" && c2value == 2) {
            return -1;
        } else if (c1value == 1 && c2value == "J") {
            return -1;
        } else if (c1value == "J" && c2value == "Q") {
            return -1;
        } else if (c1value == "Q" && c2value == "K") {
            return -1;
        } else {
            return 0;
        }

    } else {
        // check the tableau
        if (((c1suite == 'H' || c1suite == 'D') && (c2suite == 'C' || c2suite == 'S')) || ((c1suite == 'C' || c1suite == 'S') && (c2suite == 'H' || c2suite == 'D'))) {
            // see if both card values are numbers, if not compare face cards
            if (!isNaN(c1value) && !isNaN(c2value)) {
                if (c1value - c2value == 1) {
                    if (c1value == 2 && c2value == 1) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else if (c1value == 1 && c2value == 9) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (c1value == "J" && c2value == 1) {
                return 1;
            } else if (c1value == "Q" && c2value == "J") {
                return 1;
            } else if (c1value == "K" && c2value == "Q") {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
}

function DisplayCard(card, elemID, pileSize, makeDroppable) {
    // convert from 1* data format to 10* img format
    if (card[0] == 1) {
        card = 10 + card[1];
    }
    if (elemID == "waste") {
        document.getElementById(elemID).innerHTML = "<img src=\"images/" + card + ".png\" class=\"card\" onClick=\"CheckCard(this.src,this.parentElement.id)\" ondragstart=\"drag(event,this.src,this.parentElement.id)\">";
    } else if (elemID == "hearts" || elemID == "diamonds" || elemID == "clubs" || elemID == "spades") {
        document.getElementById(elemID).innerHTML = "<img src=\"images/" + card + ".png\" class=\"card\" onClick=\"CheckCard(this.src,this.parentElement.id)\" ondragstart=\"drag(event,this.src,this.parentElement.id)\" ondrop=\"drop(event,this.parentElement.id,this.src)\" ondragover=\"allowDrop(event)\">";
    } else {
        if (card == "red_back") {
            document.getElementById(elemID).innerHTML += "<img src=\"images/" + card + ".png\" class=\"card" + pileSize + "\">";
        } else {
            if (makeDroppable) {
                document.getElementById(elemID).innerHTML += "<img src=\"images/" + card + ".png\" class=\"card" + pileSize + "\" onClick=\"CheckCard(this.src,this.parentElement.id)\" ondragstart=\"drag(event,this.src,this.parentElement.id)\" ondrop=\"drop(event,this.parentElement.id,this.src)\" ondragover=\"allowDrop(event)\">";
            } else {
                document.getElementById(elemID).innerHTML += "<img src=\"images/" + card + ".png\" class=\"card" + pileSize + "\" onClick=\"CheckCard(this.src,this.parentElement.id)\" ondragstart=\"drag(event,this.src,this.parentElement.id)\">";
            }
        }
    }

}

function ResetGame() {
    // reset the game visually
    document.getElementById("waste").innerHTML = "<img src=\"images/yellow_back.png\" class=\"card\" onclick=\"CheckCard(this.src,this.parentElement.id)\" ondragstart=\"drag(event,this.src,this.id)\">";
    document.getElementById("hearts").innerHTML = "<img src=\"images/red_back.png\" class=\"card\" ondrop=\"drop(event,this.parentElement.id)\" ondragover=\"allowDrop(event)\">";
    document.getElementById("diamonds").innerHTML = "<img src=\"images/red_back.png\" class=\"card\" ondrop=\"drop(event,this.parentElement.id)\" ondragover=\"allowDrop(event)\">";
    document.getElementById("clubs").innerHTML = "<img src=\"images/red_back.png\" class=\"card\" ondrop=\"drop(event,this.parentElement.id)\" ondragover=\"allowDrop(event)\">";
    document.getElementById("spades").innerHTML = "<img src=\"images/red_back.png\" class=\"card\" ondrop=\"drop(event,this.parentElement.id)\" ondragover=\"allowDrop(event)\">";
    for (var i = 1; i < 8; i++) {
        document.getElementById("p" + i).innerHTML = "";
    }
    document.getElementById("winbanner").style.display = "none";

    // reset the data
    tableau = [[], [], [], [], [], [], []];
    foundation = [[], [], [], []];
    deckCards = [],
        wastePile = [];

    CreateDeck();
    DealDeck();
    DisplayDeck();
}

// drag 'n drop functionality

function drag(ev, originSrc, originID) {
    ev.dataTransfer.setData("text", originSrc.slice(-6, -4) + originID);
}

function drop(ev, targetID, targetCard) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let originID = data.slice(2);
    let originCard = "";
    if (data[0] == 0) {
        originCard = 1 + data[1];
    } else {
        originCard = data.slice(0, 2);
    }

    if (targetID == "hearts" || targetID == "diamonds" || targetID == "clubs" || targetID == "spades") {

        targetCard = targetCard.slice(-6, -4);
        if (CompareCards(targetCard, originCard) == -1) {
            switch (targetID) {
                case "hearts":
                    foundation[0].push(originCard);
                    DisplayCard(originCard, "hearts", 0, true);
                    PilePop(originID);
                    break;
                case "diamonds":
                    foundation[1].push(originCard);
                    DisplayCard(originCard, "diamonds", 0, true);
                    PilePop(originID);
                    break;
                case "clubs":
                    foundation[2].push(originCard);
                    DisplayCard(originCard, "clubs", 0, true);
                    PilePop(originID);
                    break;
                case "spades":
                    foundation[3].push(originCard);
                    DisplayCard(originCard, "spades", 0, true);
                    PilePop(originID);
                    break;
            }
        }
    } else {
        targetID = targetID[1] - 1;
        targetCard = tableau[targetID][tableau[targetID].length - 1];
        if (originID == "waste") {
            var result = CompareCards(targetCard, originCard);
            if (result == 1) {
                tableau[targetID].push(originCard);
                innerHTML = document.getElementById("p" + (targetID + 1)).innerHTML.slice(0, -83);
                document.getElementById("p" + (targetID + 1)).innerHTML = innerHTML + ">";
                DisplayCard(originCard, "p" + (targetID + 1), tableau[targetID].length, true);
                PilePop(originID);
            }

        } else {
            if (originID[0] == 'p') {
                originID = originID[1] - 1;
            }
            var result = CompareCards(targetCard, originCard);

            if (result == 1) {
                // see if there are any cards on top of this one
                if (originID != "hearts" && originID != "diamonds" && originID != "clubs" && originID != "spades" && tableau[originID].indexOf(originCard) != tableau[originID].length - 1) {
                    let cardsOnTop = tableau[originID].slice(tableau[originID].indexOf(originCard));
                    let innerHTML = document.getElementById("p" + (originID + 1)).innerHTML;
                    let counter = 1;

                    // remove cards from both old graphic pile and array, place them on new graphic pile
                    // but first make original top card of new pile undroppable before it is buried
                    let oldTopCardNewPile = document.getElementById("p" + (targetID + 1)).innerHTML.slice(0, -83);
                    if (oldTopCardNewPile == undefined) {

                    } else {
                        document.getElementById("p" + (targetID + 1)).innerHTML = oldTopCardNewPile + ">";
                    }
                    cardsOnTop.forEach(function (card) {
                        tableau[originID].pop();
                        innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf("<"));
                        DisplayCard(card, "p" + (targetID + 1), tableau[targetID].length + counter, false);
                        counter++;
                    })
                    document.getElementById("p" + (originID + 1)).innerHTML = innerHTML;

                    // and make new top card of new pile droppable
                    let newTopCardNewPile = document.getElementById("p" + (targetID + 1)).innerHTML.slice(0, -1);
                    document.getElementById("p" + (targetID + 1)).innerHTML = newTopCardNewPile + " ondrop=\"drop(event,this.parentElement.id,this.src)\" ondragover=\"allowDrop(event)\">";

                    // add cards from old pile to new pile array, remove them visually from old pile
                    tableau[targetID] = tableau[targetID].concat(cardsOnTop);

                    // turn up face-down card of old pile
                    // look for 'r', beginning letter of "red_back" in img element, replace a red_back card graphic with face-up card
                    if (innerHTML[innerHTML.lastIndexOf("/") + 1] == 'r') {
                        document.getElementById("p" + (originID + 1)).innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf("red_back") - 17);
                        let card = tableau[originID][tableau[originID].length - 1];
                        DisplayCard(card, "p" + (originID + 1), tableau[originID].length, true);
                    }
                } else {
                    tableau[targetID].push(originCard);
                    innerHTML = document.getElementById("p" + (targetID + 1)).innerHTML.slice(0, -83);
                    document.getElementById("p" + (targetID + 1)).innerHTML = innerHTML + ">";
                    DisplayCard(originCard, "p" + (targetID + 1), tableau[targetID].length, true);
                    if (originID >= 0 && originID < 7) {
                        PilePop("p" + (originID + 1));
                    } else {
                        PilePop(originID);
                    }

                }
            }
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}
