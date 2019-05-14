const slots = document.querySelectorAll('.board div');
let player = 'red';
const floatingChip = document.querySelector('.chip');
let hasDropped = false;

let board = [ 
	0, 1, 2, 3, 4, 5, 6,
	7, 8, 9, 10, 11, 12, 13,
	14, 15, 16, 17, 18, 19, 20,
	21, 22, 23, 24, 25, 26, 27,
	28, 29, 30, 31, 32, 33, 34,
	35, 36, 37, 38, 39, 40, 41,
]

//add a class to each slot to represent its position
for(let i = 0; i < slots.length; i++) {
	slots[i].classList.add('c' + i);
	//create a span to represent the cut-out in each slot
	let slot = document.createElement('span');
	slots[i].appendChild(slot);
	// add the main function on each div
	slots[i].addEventListener('click', runGame); 
}

function runGame() {
	//cut the 'c' off the selected slot's class and turn it into a number
	const slotColumn = (Number(this.className.slice(1, 3)) % 7);
	//create an array to store all slots that share the same column 
	const columnArray = [];

	//loop through the board and find every element that shares the same column
	for(let i = 0; i < board.length; i++) {
		//<--------ASK ABOUT THIS LOGIC?????
		if(board[i] % 7 === slotColumn) columnArray.push(board[i]);
	}

	if(columnArray.length >= 1) dropChip(columnArray);

	function dropChip(column) {

		while(hasDropped === false) {
			hasDropped = true;
			//start at the end/or bottom of the columnArray
			for(let i = column.length - 1; i >= 0; i--) {
				if(column[i] !== 'red' || column[i] !== 'yellow') {
					//create the chip that'll be dropped
					let chip = document.createElement('div');
					//add the appropiate drop animation to the chip
					chip.style.animationName = "drop-" + i;
					//add the class to the chip
					chip.classList.add(player);
					//update the board array
					board[column[i]] = player; 
					//update the slots array
					slots[column[i]].appendChild(chip);
					checkForWin(board, player);
					switchPlayer(player);
				 	floatingChip.classList.toggle('switch');
				 	setTimeout(function() {hasDropped = false;}, 600);
					break;
				}	
			}
		}
	}

	function checkForWin(b, p) {
		//create an array to hold the winning combo 
		let winningCombo = [];
		let num = 0;

		//check horizontal
		for(let k = 0; k < 36; k+=7) {
			for(let i = k; i < k + 4; i++) {
				if(b[i] === p &&
				   b[i + 1] === p &&
				   b[i + 2] === p &&
				   b[i + 3] === p) {
				    winningCombo.push(slots[i], slots[i + 1], slots[i + 2], slots[i + 3]);
				}
			}			
		}

		//check vertical
		for(let k = 0; k < 7; k++) {
			for(let i = k; i < 21; i+=7
				) {
				if(b[i] === p &&
				   b[i + 7] === p &&
				   b[i + 14] === p &&
				   b[i + 21] === p) {
				    winningCombo.push(slots[i], slots[i + 7], slots[i + 14], slots[i + 21]);
				}
			}
		}

		//check diagonal right
		for(let k = 0; k < 15; k+=7) {
			for(let i = k; i < k + 4; i++) {
				if(b[i] === p &&
				   b[i + 8] === p &&
				   b[i + 16] === p &&
				   b[i + 24] === p) {
				    winningCombo.push(slots[i], slots[i + 8], slots[i + 16], slots[i + 24]);
				}
			}
		}

		//check diagonal left
		for(let k = 6; k < 21; k+=7) {
			for(let i = k; i > k - 4; i--) {
				if(b[i] === p &&
				   b[i + 6] === p &&
				   b[i + 12] === p &&
				   b[i + 18] === p) {
				    winningCombo.push(slots[i], slots[i + 6], slots[i + 12], slots[i + 18]);
				}
			}
		}

		if(winningCombo.length !== 0) {
			endGame(winningCombo);
		}
	}

	function switchPlayer(currentPlayer) {
		if(currentPlayer === 'red') player = 'yellow';
		else if(currentPlayer ==='yellow') player = 'red';
	}

	function endGame(combo) {
		const body = document.querySelector('body');

		for(let i = 0; i < slots.length; i++) {
			slots[i].removeEventListener('click', runGame);
		}
		//animate winning chips after .6s(when the drop animation has finished)
		setTimeout(function() {
			for(let i = 0; i < combo.length; i++) {
				combo[i].lastChild.style.animationDuration = ".3s";
				combo[i].lastChild.style.animationIterationCount = "infinite";
				combo[i].lastChild.style.animationName = "winner";
			}	
		}, 600);
		//display winner
		setTimeout(function() {
			const showResults = document.createElement('div');
			const playAgain = document.createElement('div');
			playAgain.addEventListener('click', function() {location.reload();})
			showResults.classList.add('show-results');
			playAgain.classList.add('play-again');
			body.appendChild(showResults);
			body.appendChild(playAgain);
			switchPlayer(player);
			playAgain.innerHTML = 'play again';
			showResults.innerHTML = player + ' wins';
			body.style.backgroundColor = player;
		}, 600);
		//hide board
		setTimeout(function() {
			const board = document.querySelector('.board-wrapper');
			board.style.marginBottom = '-606px';
		}, 3500)			
	}
}

