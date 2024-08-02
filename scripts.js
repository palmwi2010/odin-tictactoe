const gameBoard = (() => {
    
    let squares = ['', '', '', '', '', '', '', '', '']

    const addCross = idx => {
        console.log(squares);
        if (squares[idx] === '') {
            squares[idx] = 'X';
            return true
        } else {
            console.log('Square not clear');
            return false
        }
    }

    const addCircle = idx => {
        if (squares[idx] === '') {
            squares[idx] = 'O';
            return true;
        } else {
            console.log('Square not clear');
            return false;
        }
    }

    let rowIsWon = (row) => {
        if (row.every(element => element === 'X')) {
            return 'X';
        }
        else if (row.every(element => element === 'O')) {
            return 'O';
        } else {
            return false;
        }
    }

    const resetBoard = () => {
        for (let i = 0; i < squares.length; i++) {
            squares[i] = '';
        }
    };

    const checkWin = () => {
        indices =[[0,1,2],[3,4,5],[6,7,8], [0,3,6], [1, 4, 7], [2,5,8],[0,4,8], [2,4,6]];

        for (let k = 0; k < indices.length; k++) {
            let elements = squares.filter((_, i) => indices[k].includes(i));
            let check = rowIsWon(elements);
            if (check) return check;
        }
        return false;
    }

    return {squares, addCross, addCircle, checkWin, resetBoard}
})();

const Player = (i, symbol) => {
    let name = `Player ${i}`;
    let score = 0;

    let incrementScore = () => score = score + 1;

    let getScore = () => score;

    return {name, symbol, score, incrementScore, getScore}
}

const game = (() => {

    // Control turn
    let turn = 0;
    let changeTurn = () => {
        turn = turn===0? 1:0;
    }

    let handleClick = e => {

        let squareIdx = e.target.dataset.square;

        if (turn === 0) {
            if (!gameBoard.addCross(squareIdx)) return;;
        } else {
            if (!gameBoard.addCircle(squareIdx)) return;
        }
        console.log(gameBoard.squares);
        displayManager.updateSquares();
        let winner = gameBoard.checkWin();
        if (winner) {
            if (winner === 'X') {
                players[0].incrementScore();
            } else {
                players[1].incrementScore();
            }
            displayManager.winMessage(winner);
        } else {
            changeTurn();
            displayManager.updateAnnouncer();
        }
    }

    let getTurn = () => {
        return turn;
    }

    let resetGame = () => {
        gameBoard.resetBoard();
        turn = 0;
        displayManager.resetSquares();
        displayManager.updateSquares();
        displayManager.updateAnnouncer();
    }

    let players = [Player(1,'X'), Player(2,'O')]

    return {handleClick, getTurn, resetGame, players};
})();

const displayManager =(() => {

    // Get squares and heading message
    const announcer = document.querySelector('.announcer');
    const squares = document.querySelectorAll('.game-square');
    const resetBtn = document.querySelector('.reset-btn');

    const p1score = document.querySelector('#p1score');
    const p2score = document.querySelector('#p2score');

    // Add reset button
    resetBtn.addEventListener('click',game.resetGame);

    let init = () => {
        for (let i = 0; i < squares.length; i++) {
            squares[i].setAttribute('data-square', i);
            squares[i].classList.remove('set');
            squares[i].classList.add('unset');
            squares[i].addEventListener('click', game.handleClick);
        }
    }

    let resetSquares = () => {
        for (let i = 0; i < squares.length; i++) {
            squares[i].classList.remove('set');
            squares[i].classList.add('unset');
            squares[i].removeEventListener('click', game.handleClick);
            squares[i].addEventListener('click', game.handleClick);
            squares[i].innerText = '';
        }
        resetBtn.classList.remove('triggered');
    }

    let updateSquares = () => {
        console.log(gameBoard.squares);
        for (let i = 0; i < squares.length; i++) {
            if (gameBoard.squares[i] != '') {
                squares[i].classList.remove('unset');
                squares[i].classList.add('set');
                squares[i].innerText = gameBoard.squares[i];
            }
        }
    }

    let updateAnnouncer = () => {
        if (game.getTurn() === 0) {
            announcer.textContent = "Player 1's turn (X)"
        } else {
            announcer.textContent = "Player 2's turn (O)";
        }
    }

    let disableSquares = () => {
        squares.forEach(square => {
            square.removeEventListener('click', game.handleClick);
            square.classList.remove('unset');
            square.classList.add('set');
        });
    }

    let winMessage = symbol => {

        let player = (symbol === 'X') ? 1:2;
        announcer.textContent = `Player ${player} wins - congratulations!`;
        resetBtn.classList.add('triggered');
        disableSquares();

        console.log(game.players[0].score);
        p1score.innerText = game.players[0].getScore();
        p2score.innerText = game.players[1].getScore();
    }

    return {init, updateSquares, updateAnnouncer, winMessage, resetSquares};
})();

displayManager.init();
displayManager.updateSquares();
