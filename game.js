const gameOfLife = {
	//width and height dimensions of the board
	width: 12,
	height: 12,
	//will be used to hold reference to an interval that is "playing" the game
	stepInterval: null,

	createAndShowBoard() {
		var goltable = document.createElement('tbody');

		var tablehtml = '';
		for (var h = 0; h < this.height; h++) {
			tablehtml += "<tr id='row+" + h + "'>";
			for (var w = 0; w < this.width; w++) {
				tablehtml += "<td data-status='dead' id='" + w + '-' + h + "'></td>";
			}
			tablehtml += '</tr>';
		}
    //create table
		goltable.innerHTML = tablehtml;

		//add table to the #board element
		var board = document.getElementById('board');
		board.appendChild(goltable);

		//once html elements are added to the page, attach events to them
		this.setupBoardEvents();
	},

  //grabbing each cell on the board within an array
	forEachCell(iteratorFunc) {
		return Array.from(document.getElementsByTagName('td'));
	},

	setupBoardEvents() {
    //assign all click events to each cell
		const onCellClick = function(e) {

      //setting the status of the className as either dead or alive
			if (this.dataset.status == 'dead') {
				this.className = 'alive';
				this.dataset.status = 'alive';
			} else {
				this.className = 'dead';
				this.dataset.status = 'dead';
			}
		};

    //example of click event at cell 0-0
		//var cell00 = document.getElementById('0-0');
		//cell00.addEventListener('click', onCellClick);

		window.board.addEventListener('click', evt => onCellClick.call(evt.target));
	},

	step() {
		// Here is where you want to loop through all the cells
		// on the board and determine, based on it's neighbors,
		// whether the cell should be dead or alive in the next
		// evolution of the game.
		//
		// You need to:
		// 1. Count alive neighbors for all cells
		// 2. Set the next state of all cells based on their alive neighbors
	},

	enableAutoPlay() {
		// Start Auto-Play by running the 'step' function
		// automatically repeatedly every fixed time interval
	}
};

gameOfLife.createAndShowBoard();

//1.) assign click handler to all cells: get a cell, reduce neighbords, apply next state
//2.) computer next step
//3.) apply state
//4.) clear
//5.) assign step to interval
//6.) randomize

//lexical scopes
