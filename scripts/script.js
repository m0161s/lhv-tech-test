// components
const {
    CardComponent, 
    DrawButton, 
    HeaderComponent, 
    PlayButton, 
    ResetButton, 
    ScoreComponent, 
    TurnComponent, 
    WinComponent
} = CARDGAME.module.components

// util
const {
    initialState,
    checkTotalScore,
    getScore,
    createDeck,
    shuffleDeck
} = CARDGAME.module.util


function startGame() {
    let state = initialState;
    let deck = createDeck();
    const players = Object.keys(state.players);

    // VIEW
    function renderComponents() {
        const playerOne = state.players[players[0]];
        const playerTwo = state.players[players[1]];

        return `
            ${HeaderComponent()}
            ${ state.winner 
                ? WinComponent(state.winner)
                : TurnComponent(state.turn)
            }
            <div> ${players[0]} </div>
            ${CardComponent(playerOne.cards.at(-1))}
            ${ScoreComponent(playerOne.score, playerOne.totalScore)}
            <div>Cards: ${playerOne.cards} </div>
            <br>
            <div> ${players[1]} </div>
            ${CardComponent(playerTwo.cards.at(-1))}
            ${ScoreComponent(playerTwo.score, playerTwo.totalScore)}
            <div>Cards: ${playerTwo.cards} </div>
            <br>
            ${DrawButton(state.winner)}
        `
    }

    // LOGIC 
    function drawCard() {
        setResult(deck.drawFromDeck());
    }

    function resetGame() {
        state = initialState;
        deck = createDeck();
        loadGame();
    }
    
    function loadGame() {
        const [playerOne, playerTwo] = [players[0], players[1]]
        shuffleDeck(deck.getDeck());
        setResult(deck.drawFromDeck(), playerOne);
        setResult(deck.drawFromDeck(), playerOne);
        setResult(deck.drawFromDeck(), playerTwo);
        setResult(deck.drawFromDeck(), playerTwo);
        setState(state => ({
            ...state,
            loading: false
        }))
    }

    function setState(handler) {
        state = handler(state);
    }

    function setResult(card, _player) {
        const player = _player ||= players[state.turn];
        setScore(player, card)
        const totalScore = checkTotalScore(state, player);
        isWinner(player, totalScore);
        updateGame();
        attactEvents();
    }

    function setScore(player, card){
        const score = getScore(card);
        setState(state => ({
            ...state,
            players: {
                ...state.players,
                [player]: {
                    score,
                    totalScore: state.players[player].totalScore + score,
                    cards: state.players[player].cards.concat(card)
                }
            }
        }));
    }

    function isWinner(player, totalScore) {
        const turn = (state.loading && player !== players[0]) ? state.turn : state.turn + 1;
        if (totalScore === 0) {
            state.turn === 0 
                ? setState(state => ({...state, turn }))
                : setState(state => ({...state, turn: state.turn + 1, winner: getWinner()}));
        } else if (totalScore === 1) { 
            setState(state => ({...state, winner: player}));
        } else if (totalScore === 2) {
            setState(state => ({...state, winner: getWinner(player)}));
        }
        if (state.turn === 2) {
            setState(state => ({...state, winner: getWinner()}));
        }
    }

    function getWinner(loser) {
        const playerOneTotalScore = state.players[players[0]].totalScore;
        const playerTwoTotalScore = state.players[players[1]].totalScore;

        if (loser) {
            return loser === players[0] ? players[1] : players[0];
        } else if (playerOneTotalScore > playerTwoTotalScore) {
            return players[0];
        } else if (playerOneTotalScore < playerTwoTotalScore) {
            return players[1];
        } else {
            return 'draw'
        }
    }

    function updateGame () {
        document.querySelector('body').innerHTML = renderComponents();
    }

    // EVENTS
    function attactEvents() {
        const mode = !state.winner ? drawCard : resetGame;
        document.getElementById('draw')
            .addEventListener('click', mode);
    }

    return { loadGame }
}

startGame().loadGame();


