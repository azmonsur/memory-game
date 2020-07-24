  "use strict"
  
  /*------Pick Element from Document------------------*/
  var board         = document.querySelector('#board'),
      startBtn      = document.querySelector('#btn-start'),
      newGameBtn    = document.querySelector('#btn-new-game'),
      restartBtn    = document.querySelector('#restart-game'),
      startControl  = document.querySelector('#start-control'),
      
  		 playerVal1    = document.querySelector('#input-player-1'),
      playerVal2    = document.querySelector('#input-player-2'),
      
      playerName1   = document.querySelector('#player-1-name'),
      playerName2   = document.querySelector('#player-2-name'),
      playerScore1  = document.querySelector('#player-1-score'),
      playerScore2  = document.querySelector('#player-2-score'),
      
      nameBoard     = document.querySelector('#player-name'),
      playerInfo    = document.querySelector('#player-name-info'),
      nameError     = document.querySelector('#name-error'),
      scoreBoard    = document.querySelector('#score');
  
  /*-----Variables Initialization--------------*/
  let [hasFlipped, lockBoard, switchPlayer] = [false, false, false],
      [cardFlipped, playerOneScore, playerTwoScore] = [0, 0, 0],
      [playerOneColor, playerTwoColor, cardScores] = ['#ffce00', '#cb74ff', {}],
      firstCard, secondCard, whoWon;
  
  /*----Card Objects------=--*/
  var cardNames = [
    {name:"king", symbol:"k", rank:15},
    {name:"queen", symbol:"q", rank:10},
    {name:"prince", symbol:"p", rank:11},
    {name:"noble", symbol:"b", rank:9},
    {name:"knight", symbol:"n", rank:6},
    {name:"duke", symbol:"z", rank:13},
    {name:"earl", symbol:"r", rank:10},
    {name:"baron", symbol:"t", rank:8},
    {name:"judge", symbol:"j", rank:7},
    {name:"mayor", symbol:"m", rank:8},
    {name:"sire", symbol:"s", rank:5},
    {name:"lord", symbol:"l", rank:6},
    {name:"maid", symbol:"i", rank:3},
    {name:"wizard", symbol:"x", rank:14},
    {name:"ace", symbol:"h", rank:4}
  ]
  
  /*---Copy CARD OBJECTS twice---*/
  cardNames = [...cardNames, ...cardNames]
  
  /*---Enter constants to set cards widths and heights*/
  const [col, totalCards] = [6, cardNames.length];
  const [width, height]   = [100/col, 100/(totalCards/col)]
  
  /*---Sort array by names---*/
  var byName = cardNames.slice(0); 
  byName.sort(function(a,b) { 
  		var x = a.name.toLowerCase(); 
  		var y = b.name.toLowerCase(); 
  		return x < y ? -1 : x > y ? 1 : 0; 
  		}); 
  		
  /*---Sort array by ranks---*/
  var byRank = [...cardNames]; 
  byRank.sort(function(a,b) { 
  		return b.rank - a.rank; 
  		});
  
  /*---When Document is Ready---*/
  document.addEventListener("DOMContentLoaded", ()=>{
  		board.innerHTML = "";
  		
     byRank.forEach(card=>{
  				board.innerHTML += `
  					<div id="mem-game" class="mem-game" data-frame="${card.name}">
    		   		<div class="frontface king">
      				  <div class="position">
        			    <span class="uid"></span>
        			    <span class="card-score">${card.rank}</span>
      				  </div>
      				  <div class="card-symbol">
      				    ${card.symbol}
      				  </div>
      				  <span class="card-name">
      				    ${card.name}
      				  </span>
               </div>
    					<div class="backface">js</div>
       		 </div>`//mind the (opening and closing) quote
       		 
     cardScores[card.name] = card.rank;
  		})
  		
  	/*---Select CARD Elements, PLAYERS ID colors from the Document---*/
  var cards = document.querySelectorAll('.mem-game'),
      playerColors  = document.querySelectorAll('.uid');
      
  
  /*---Set dimensions---*/
  cards.forEach(card=>{
  		card.style.width = `calc(${width}% - 10px)`;
  		card.style.height = `calc(${height}% - 10px)`;
  		})
  		
  	/*---Onclick events of START, RESTART and NEW GAME buttons---*/
  	startBtn.addEventListener('click', startGame);
  	newGameBtn.addEventListener('click', reloadGame);
  	restartBtn.addEventListener('click', restartGame);  
  	
  /*---Contorol Certain behavior - for Demo, uncomment to activate--*/
  //controlActions();
  
  
  		
  /*-------------------------------------------------------------------------------------
  		Function Definitions
  	------------------------------------------------------------------------------------*/		
  	
  /*----==DEFAULT-SETTING==---------------------------*/
  function defaultSetting() {
  		playerName1.style.color = 'red';
  		playerName2.style.color = 'white';
  		restartBtn.style.visibility = "visible";
  		
  		scoreBoard.style.transform = 'scale(1)';
  		playerColors.forEach(color=>color.style.background = 'inherit');
  		setTimeout(shuffle, 500);
  		startControl.style.transform = "scale(0.0001)";
  		
  		playerScore1.innerHTML = 0;
  		playerScore2.innerHTML = 0;
  		playerName1.style.borderColor = playerOneColor;
  		playerName2.style.borderColor = playerTwoColor;
  		}
  
  
  /*----==FLIP-CARD==---------------------------*/
  function flipCard(){
  		if (lockBoard) return;
  		if (this === firstCard) return;
  		this.classList.add('flip');
  		
  		//if card is never flipped
  		if (!hasFlipped) {
  				hasFlipped = true;
  				firstCard  = this;
  				firstCard.querySelector(".card-symbol").classList.add('zoom');
  				
  				return
  				}// end IF
  				
  		hasFlipped = false;
  		secondCard = this;
  				
  		checkForMatch();
  		}// end function FLIPCARD
  	
  	
  	/*----==CHECK-FOR-MATCH==---------------------------*/	
  function checkForMatch() {
  		let isMatch = firstCard.dataset.frame === secondCard.dataset.frame;
  		isMatch ? disableCard() : unflipCard();
  		}


 	/*----==DISABLE-CARD==---------------------------*/
  function disableCard() {
  		firstCard.querySelector(".card-symbol").classList.remove('zoom');
  		secondCard.querySelector(".card-symbol").classList.remove('zoom');
  		
  		firstCard.removeEventListener('click', flipCard);
  		secondCard.removeEventListener('click', flipCard);
  		
  		//functions call
  		cardFlipped++; calcScore(); nextPlayer(); gameOver(); resetBoard();
  		}


 	/*----==UNFLIP-CARD==---------------------------*/
  function unflipCard() {
  		lockBoard = true;
  		nextPlayer();
  		
  		setTimeout(() => {
  			firstCard.classList.remove('flip');
  			secondCard.classList.remove('flip');
  			resetBoard();
  			}, 1000)
  		}


 	/*----==RESET-BOARD==---------------------------*/
  function resetBoard() {
  		[hasFlipped, lockBoard] = [false, false];
  		[firstCard, secondCard] = [null, null];
  		}


 	/*----==SHUFFLE==---------------------------*/
  function shuffle(){
  		cards.forEach(card => {
  				let randomPos = Math.floor(Math.random() * cards.length);
  				card.style.order = randomPos;
  				});
  		}//end function SHUFFLE  


 	/*----==SHOW-TIME==---------------------------*/
  function showTime() {
  		let time = document.querySelector('#time');
  		for (var i=0; i<60; i++) {
  				setTimeout(()=>{
  						time.innerHTML = `${i}`;
  						}, 1000)
  				}
  		}


 	/*----==START-GAME==---------------------------*/
  function startGame() {                 
      if (playerVal1.value.length > 10 || playerVal2.value.length > 10) {
     		nameError.innerHTML = "*Player names must not be more than 10 char.";
     		nameError.style.color = "red";
    		  return;
     		}                  
     
     nameError.innerHTML = "(10 characters or less)";
     nameError.style.color = "yellow"
  		cards.forEach(card => {
  			 card.classList.remove('flip');
  			 card.addEventListener('click', flipCard);
  			 })
  		
  		defaultSetting();
  		if (playerVal1.value != '') {
  				playerName1.innerHTML = `${playerVal1.value}`;
  				}
  		if (playerVal2.value != '') {
  				playerName2.innerHTML = `${playerVal2.value}`;
  				}
  		}
  		

 	/*----==RESTART-GAME==---------------------------*/  
 	function restartGame() {
 			let response = confirm("Quit game?")
 			if (response) reloadGame();
 			}	  



 	/*----==RELOAD-GAME==---------------------------*/  		
  function reloadGame() {
  		nameBoard.style.fontSize = "inherit";
  		nameBoard.innerHTML = playerInfo.innerHTML;
  		
  		newGameBtn.style.display = "none";
  		startBtn.innerHTML = "Start Game";
  		startGame(); resetValues();
  		
  		scoreBoard.style.transform = 'scale(0.001)';
  		restartBtn.style.visibility = "hidden";
  		startControl.style.transform = "scale(1) translate(0, -40%)";
  		
  		setTimeout(()=>{
  		playerName1.innerHTML = "Player 1";
  		playerName2.innerHTML = "Player 2";
  		playerVal1    = document.querySelector('#input-player-1');
     playerVal2    = document.querySelector('#input-player-2');
  		},1000)
  		
  		}  		
  		
  		

 	/*----==GAME-OVER==---------------------------*/  		
  function gameOver() {
  		let total = totalMark(),
  		    scoreDifference = Math.abs(playerOneScore - playerTwoScore),
  		    scoreAggregate  = playerOneScore + playerTwoScore;
  		winner();
  		
  		if (cardFlipped == (cards.length / 2) - 1 || 
  				(scoreDifference > (total - scoreAggregate))) {
  				startControl.style.transform = "scale(1) translate(0, -40%)";
  				nameBoard.innerHTML = `Game Over<p class="who-won">${whoWon}</p>`;
  				
  				nameBoard.style.fontSize = "4em";
  				newGameBtn.style.display = "block";
  				startBtn.innerHTML = "Play Again";
  				
  				restartBtn.style.visibility = "hidden";
      		resetValues();
      		}
  		}


 	/*----==RESET-VALUES==---------------------------*/  		
  function resetValues() {
  		playerOneScore = 0,
     playerTwoScore = 0,
  		cardFlipped = 0;
  		switchPlayer = false;
  				
  		cards.forEach(card=>card.removeEventListener('click', flipCard))
  		}


 	/*----==CALCULATE-SCORE==---------------------------*/ 		
  function calcScore() {
  		if (!switchPlayer) {
  				playerOneScore += parseInt(cardScores[secondCard.dataset.frame]);
  				playerScore1.classList.toggle('fade-ACW');
  				
  		     firstCard.querySelector(".uid").style.background = playerOneColor
  				secondCard.querySelector(".uid").style.background = playerOneColor
  				}
  		else {
  				playerTwoScore += parseInt(cardScores[secondCard.dataset.frame]);
  				playerScore2.classList.toggle('fade-CCW');
  				
  				firstCard.querySelector(".uid").style.background = playerTwoColor
  				secondCard.querySelector(".uid").style.background = playerTwoColor
  				}
  		 
  		playerScore1.innerHTML = playerOneScore;
  		playerScore2.innerHTML = playerTwoScore;
  		}


 	/*----==NEXT-PLAYER==---------------------------*/		
  function nextPlayer() {
  		if (switchPlayer) {
  				switchPlayer = false;
  				playerName1.style.color = 'red';
  				playerName2.style.color = 'white';
  				}
  		else {
  				switchPlayer = true
  				playerName1.style.color = 'white';
  				playerName2.style.color = 'red';
  				}
  		}


 	/*----==WINNER==---------------------------*/  		
  function winner() {
  		if (playerOneScore > playerTwoScore) {
  				whoWon = playerName1.innerHTML + " won!";
  				}
  		else if(playerOneScore < playerTwoScore) {
  				whoWon = playerName2.innerHTML + " won!";
  				}
  		else whoWon = "It's a draw"
  		}
  		
  		
  /*----==TOTAL-MARK==---------------------------*/
  function totalMark() {
  		let total = 0;
  		for (var card in cardScores) {
  				total += parseInt(cardScores[card])
  				}
  		return total;
  		}
  		
  		
  /*----==CONTROL-ACTIONS==---------------------------*/
  function controlActions() {
  		startControl.style.display = "none";
  		cards.forEach(card=>card.classList.add('flip'));
  		}
  		
})//end DOMContentLoaded
