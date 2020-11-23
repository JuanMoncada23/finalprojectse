const options = document.querySelector(".options");

const aiBtn = document.querySelector(".ai");
const humanBtn = document.querySelector(".human"); 
const xBtn = document.querySelector(".x");
const oBtn = document.querySelector(".o");
const playBtn = document.querySelector(".play");
const gameOverElement = document.querySelector(".gameover");

const player = new Object;
let OPPONENT;

aiBtn.addEventListener("click", function(){
    OPPONENT = "ai";
    switchActive(humanBtn, aiBtn); 
}); 

humanBtn.addEventListener("click", function(){
    OPPONENT = "human";
    switchActive(aiBtn, humanBtn); 
});

xBtn.addEventListener("click", function(){
    player.man = "X";
    player.ai = "O"; 
    player.human = "O"; 

    switchActive(oBtn, xBtn); 
});

oBtn.addEventListener("click", function(){
    player.man = "O";
    player.ai = "X"; 
    player.human = "X"; 

    switchActive(xBtn, oBtn); 
}); 

playBtn.addEventListener("click", function(){
    if(!OPPONENT){
        aiBtn.style.backgroundColor = "red";
        humanBtn.style.backgroundColor = "red";
        return;
    }

    if(!player.man){
        oBtn.style.backgroundColor = "red";
        xBtn.style.backgroundColor = "red";
        return; 
    }
    
    init(player, OPPONENT);
    options.classList.add("hide"); 

});

function switchActive(off, on){
    off.classList.remove("active");
    on.classList.add("active"); 
}