
CARDGAME.module.util.initialState = {
    players: {
        macs: {
            score: 0,
            totalScore: 0,
            cards: []
        },
        dealer: {
            score: 0,
            totalScore: 0,
            cards: []
        }
    },
    winner: null,
    turn: 0,
    loading: true
}

// 0 = turn over | 1 = winner | 2 = loser | false = turn not over
CARDGAME.module.util.checkTotalScore = (state, player) => {
    const playerScore = state.players[player].totalScore
    if (playerScore === 21) {
        return 1
    } else if (playerScore > 21) {
        return 2
    } else if (playerScore > 17 && playerScore < 21) {
        return 0
    }
    return false
}

// card = S2 = spade2
CARDGAME.module.util.getScore = (card) => {
    const cardHand = card.slice(1)
    const isRoyal = ["J", "K", "Q"].some(hand => hand === cardHand);
    const isAce = "A" === card[1];

    if (isRoyal) {
        return 10;
    } else if (isAce) {
        return 11;
    } else {
        return parseInt(cardHand);
    }
}

CARDGAME.module.util.createDeck = () => {
    const suits = ["H", "D", "S", "C"];
    const hands = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];

    for (let suit of suits) {
        for (let hand of hands) {
            deck.push(suit + hand);
        }
    }

    return {
        getDeck: () => deck,
        drawFromDeck: () => deck.pop()
    };
}

function randomPosition(idx, max) {
    let num = idx;
    // make sure random num is not same as index
    while (num === idx) {
        num = Math.floor(Math.random() * max);
    }
    return num;
}

CARDGAME.module.util.shuffleDeck = (deck) => {
    for (let i = 0; i < deck.length; i++) {
        const randIdx = randomPosition(i, deck.length);
        [deck[i], deck[randIdx]] = [deck[randIdx], deck[i]];
    }
}

