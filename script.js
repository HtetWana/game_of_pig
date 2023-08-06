(function () {

    'use strict';

    const gameData = {
        dieImg: ["dice/dice-six-faces-one.png", "dice/dice-six-faces-two.png", "dice/dice-six-faces-three.png",
            "dice/dice-six-faces-four.png", "dice/dice-six-faces-five.png", "dice/dice-six-faces-six.png"],
        player: [],
        score: [0, 0],
        die1: 0,
        die2: 0,
        diceTotal: 0,
        cumulativePoints : 0 ,
        index: 0,
        checkPoint: 0
    }

    const control = document.getElementById('gamecontrol');
    const gameStatus = document.getElementById('game');
    const actions = document.getElementById('actions');
    const score = document.getElementById('score');
    const from = document.querySelector('#playerForm');
    const fromBtn = document.querySelector('#playerForm button');
    const from1 = document.querySelector('#playerForm #player1');
    const from2 = document.querySelector('#playerForm #player2');
    const check = document.querySelector('#playerForm #checkPoint');


    fromBtn.addEventListener('click',function(e){  
        if(from1.value && from2.value && check.value){
           
            e.preventDefault();
            from.innerHTML= ''
            gameData.checkPoint = parseInt(check.value);
            gameData.player[0] = from1.value ;
            gameData.player[1] = from2.value ;

            control.innerHTML = `
            <h2>Start Game</h2>
            <button id="startgame">Randonly Pick the First Player, and Start the Game</button>`;

            document.getElementById('startgame').addEventListener('click', function () {
                control.innerHTML = `<h2>The game has started</h2><button id="endBtn">Quit the game.</button>`;
        
                document.getElementById('endBtn').addEventListener('click', function () {
                    location.reload();
                })
        
                gameData.index = Math.round(Math.random());
                setTurn();
        
            })
        }
    })

    function setTurn() {
        gameStatus.innerHTML = `
        <p>It's <strong>${gameData.player[gameData.index]}</strong>'s turn!</p>
        <p>Roll the dice for <strong>${gameData.player[gameData.index]}.</strong></p>`;
        actions.innerHTML = `<button id="roll">Roll</button>`

        document.getElementById('roll').addEventListener('click', rollDice);
    }

    function rollDice() {

        gameData.die1 = Math.floor(Math.random() * 6) + 1;
        gameData.die2 = Math.floor(Math.random() * 6) + 1;

        gameStatus.innerHTML = `
        <p>Dice for <strong>${gameData.player[gameData.index]}</strong></p>
        <img src="${gameData.dieImg[gameData.die1 - 1]}" alt="die"/>
        <img src="${gameData.dieImg[gameData.die2 - 1]}" alt="die"/>`;

        gameData.diceTotal = gameData.die1 + gameData.die2;

        if (gameData.diceTotal === 2) {

            actions.innerHTML = '';
            gameStatus.innerHTML += `<p>Oh snap! You got  <strong>snake eyes!</strong> Your turn is over.</p>`;
            gameData.score[gameData.index] = 0;
            updateScore();
            gameData.index ? gameData.index = 0 : gameData.index = 1;
            setTimeout(setTurn, 3000);

        } else if (gameData.die1 === 1 || gameData.die2 === 1) {

            actions.innerHTML = '';
            gameData.index ? gameData.index = 0 : gameData.index = 1;
            gameStatus.innerHTML += `<p>You rolled a <strong>one!</strong> Switching to <strong>${gameData.player[gameData.index]}</strong></p>`;
            if(gameData.cumulativePoints !== 0){
                gameStatus.innerHTML +=`<p><strong>Cumulated total score zeroed out!</strong></p>`;
            }
            gameData.cumulativePoints = 0;
            setTimeout(setTurn, 3000);

        } else {           
            gameData.cumulativePoints += gameData.diceTotal;
            gameStatus.innerHTML += `<p>Cumulated Total : ${gameData.cumulativePoints}</p>`;

            if(gameData.cumulativePoints > gameData.checkPoint ||
                gameData.score[gameData.index]+gameData.cumulativePoints > gameData.checkPoint){
                gameData.score[gameData.index] += gameData.cumulativePoints;
            }

            actions.innerHTML = `<button id="rollAgain">Roll Again</button> --- or --- <button id="pass">Pass</button>`
            document.getElementById('rollAgain').addEventListener('click', rollDice);
            document.getElementById('pass').addEventListener('click', function () {
                
                gameData.score[gameData.index] += gameData.cumulativePoints;
                updateScore();
                gameData.cumulativePoints = 0;
                gameData.index ? gameData.index = 0 : gameData.index = 1;
                setTurn();
            })

            checkWinner();
        }
    }

    function checkWinner() {
        if (gameData.score[gameData.index] > gameData.checkPoint) {
            gameStatus.innerHTML = '';
            control.innerHTML = '';
            actions.innerHTML = '';
            score.innerHTML =
                `<h1><span>${gameData.player[gameData.index]} wins! with ${gameData.score[gameData.index]} points! </span></h1>
            <button id='restart'>Restart</button>`;
            document.getElementById('restart').addEventListener('click', function () {
                location.reload();
            })
        } else {
            updateScore();
        }
    }

    function updateScore() {
        score.innerHTML =
            `<h3>Total Scores</h3>
        <p><span>${gameData.player[0]} : ${gameData.score[0]}</span><span>${gameData.player[1]} : ${gameData.score[1]}</span></p>`;
    }

})();