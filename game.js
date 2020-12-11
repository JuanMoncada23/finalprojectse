function init(player,OPPONENT){
    //Select canvas 
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d"); 

    //Board variables 
    let board = [];
    const COLUMN = 3;
    const ROW = 3;
    const SPACE_SIZE = 150;

    //Stores player's moves 
    let gameData = new Array(9);

    //By default human player plays first 
    let currentPlayer = player.man;

    //Loads X & O images 
    const xImage = new Image();
    xImage.src = "img/X.png";
    const oImage = new Image();
    oImage.src = "img/O.png";

    //Win combinations 
    const COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let GAME_OVER = false; 

    //Draws board 
    function drawBoard(){
        let id = 0;
        for(let i=0; i<ROW; i++){
            board[i] = [];
            for(let j=0; j<COLUMN; j++){
                board[i][j] = id;
                id++; 

                //Draws spaces 
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 5; 
                ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
            }
        }
    }
    drawBoard(); 

    //On player's click 
    canvas.addEventListener("click", function(event){
        if(GAME_OVER) return; 

        //X & Y postiion on the canvas 
        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;

        //Calculates i & j of the clicked space 
        let i = Math.floor(Y/SPACE_SIZE);
        let j = Math.floor(X/SPACE_SIZE);

        //Gets ID of the space clicked on 
        let id = board[i][j];

        //Prevents players to play same spot 
        if(gameData[id]) return;

        //Stores player's move data 
        gameData[id] = currentPlayer;

        drawOnBoard(currentPlayer, i, j);

        //Checks if play wins 
        if(isWinner(gameData, currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return; 
        }

        //Checks for tie game 
        if(isTie(gameData)){
            showGameOver("tie"); 
            GAME_OVER = true;
            return;
        }
    
        if(OPPONENT == "ai"){
            //Gets id of space using minimax algorithm 
            let id = minimax(gameData, player.ai).id; 

            //Stores player's move data 
            gameData[id] = player.ai; 

            let space = getIJ(id); 
            drawOnBoard(player.ai,space.i, space.j); 

            //Checks if play wins 
            if(isWinner(gameData, player.ai)){
                showGameOver(player.ai);
                GAME_OVER = true; 
                return; 
                
            }

            //Checks for tie game 
            if(isTie(gameData)){
                showGameOver("tie"); 
                GAME_OVER = true;
                return; 
            }

        } else{
            //Gives turn to other player 
            currentPlayer = currentPlayer == player.man ? player.human : player.man; 
        }

    }); 

    //Minimax 
    function minimax(gameData, PLAYER){
        if(isWinner(gameData, player.ai)) return{evaluation : +10}; 
        if(isWinner(gameData, player.man)) return{evaluation : -10}; 
        if(isTie(gameData)) return{evaluation : 0}; 

        
        let EMPTY_SPACES = getEmptySpaces(gameData);

        //Save all moves and their evaluations 
        let moves = [];

        for(let i=0; i<EMPTY_SPACES.length; i++){
            //Gets id of empty space 
            let id = EMPTY_SPACES[i];

            let backup = gameData[id]; 
            gameData[id] = PLAYER; 

            //Saves move id and evaluation 
            let move = {};
            move.id = id; 

            if(PLAYER == player.ai){
                move.evaluation = minimax(gameData, player.man).evaluation;
            } else{
                move.evaluation = minimax(gameData, player.ai).evaluation; 
            }
            gameData[id] = backup;
            moves.push(move); 
        }

        //Minimax algorithm 
        let bestMove; 

        if(PLAYER == player.ai){
            //Maximizer 
            let bestEvaluation = -Infinity;
            for(let i=0; i<moves.length; i++){
                if(moves[i].evaluation > bestEvaluation){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i]; 
                }
            }
        } else{
            //Minimizer 
            let bestEvaluation = +Infinity;
            for(let i=0; i<moves.length; i++){
                if(moves[i].evaluation < bestEvaluation){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i]; 
                }
            }
        }
        return bestMove; 

    }

    //Gets empty spaces 
    function getEmptySpaces(gameData){
        let EMPTY = [];
        for(let id=0; id<gameData.length; id++){
            if(!gameData[id]) EMPTY.push(id); 
        }
        return EMPTY; 
    }

    //Gets id of I & J 
    function getIJ(id){
        for(let i=0; i<board.length; i++){
            for(let j=0; j<board[i].length; j++){
                if(board[i][j]==id) return{i : i, j : j}
            }
        }
    }

    //Checks for a winner 
    function isWinner(gameData, player){
        for(let i=0; i<COMBOS.length; i++){
            let won = true;

            for(let j=0; j<COMBOS[i].length; j++){
                let id = COMBOS[i][j]; 
                won = gameData[id] == player && won; 
            }

            if(won){ 
                return true;  
            }
        }
        return false; 
    }

    //Checks for tie 
    function isTie(gameData){
        let isBoardFill = true;
        for(let i=0; i<gameData.length; i++){
            isBoardFill = gameData[i] && isBoardFill;
        }
        if(isBoardFill){
            return true;
        }
        return false;
    }

    //Shows gameover 
    function showGameOver(player){
        let message = player == "Tie" ? "No Winner" : "Winner is";
        let imgSrc = `img/${player}.png`;
        
        gameOverElement.innerHTML = `
            <h1>${message}</1>
            <img class="winner-img" src=${imgSrc} </img>
            <div class="play" onclick="location.reload()">Play Again</div>
        `;
        gameOverElement.classList.remove("hide");
    }

    //Draws board 
    function drawOnBoard(player, i, j){
        let img = player == "X" ? xImage : oImage;

        //x,y positon of the image are the x,y of the clicked space
        ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
    }
}