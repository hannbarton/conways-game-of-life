var gameOfLife = {
	width: 50,
	height: 50,
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

  getCell(row, col) {
    let cellIndex = document.getElementById(`${row}-${col}`);
    if (!cellIndex) return null;
      return cellIndex;
  },

  //for each cell, assign row and column
	forEachCell(iteratorFunc) {
    for (var h = 0; h < this.height; h++) {
			for (var w = 0; w < this.width; w++) {
        let cell = this.getCell(w, h)

        cell.row = w;
        cell.col = h;

        iteratorFunc(cell, w, h)
      }
    }
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

    //adding an eventlistener to each event
    this.forEachCell((cell, row, col) => {
      cell.addEventListener('click', onCellClick)
    });

    //running the this.step function
    document.getElementById('step_btn').addEventListener('click', (e) => this.step())

    //running the this.enablePlay function
    document.getElementById('play_btn').addEventListener('click', (e) => this.enableAutoPlay())

    //running the this.clear function
    document.getElementById('clear_btn').addEventListener('click', (e) => this.clear())

    //running the randomize function;
    document.getElementById('reset_btn').addEventListener('click', (e) => this.randomize())
	},

  //cataloging the different neighboring cells into an array
  neighboringCells(cellObj) {
    let neighbors = [];
    for (let row = cellObj.row - 1; row <= cellObj.row + 1; row++) {
      for (let col = cellObj.col - 1; col <= cellObj.col + 1; col++) {
      let isCell = (row === cellObj.row && col === cellObj.col);

      if (!isCell) {
        let theCell = this.getCell(row, col);
          if (theCell) {
            neighbors.push(theCell)
          }
        }
      }
    }
    return neighbors;
  },

  //determines whether the cell we are looking at should be alive or dead in the next step
  aliveOrDeadCells(cell, row, col) {
    let livingNeighbors = this.neighboringCells(cell)
    .map((el) => {
      if (el.dataset.status === 'alive')  {
        return 1;
      }
      else {
        return 0;
      }
    })
    .reduce((sum, alive) => sum + alive, 0);

    if (cell.dataset.status === 'alive') {
      if (livingNeighbors === 2 || livingNeighbors === 3) {
        return true;
      }
    }
    else if (cell.dataset.status === 'dead' && livingNeighbors === 3) {
      return true;
    }
    return false
  },

  //applies the next state to the cells in question and applies 'dead' or 'alive' to the next instance/step
  applyState(nextStateFunc) {
    this.forEachCell((cell, row, col) => {
      let theStatus = nextStateFunc[row][col] ? 'alive' : 'dead'
      cell.className = theStatus;
      cell.dataset.status = theStatus;
    })
  },

  //set the board with this.aliveOrDeadCells and this.applyState
	step() {
    //sets the board with placeholders
    let newState = new Array(this.width).fill('placeholder').map(ele => []);

    this.forEachCell((cell, row, col) => {
      newState[row][col] = this.aliveOrDeadCells(cell, row, col)
    })
    this.applyState(newState)
	},

	enableAutoPlay() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null
    }
    else {
      this.stepInterval = setInterval(() => this.step(), 200)
    }
  },

  clear() {
    //clearing the board with clearInterval
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null
    }
    //making the board empty
    this.applyState(new Array(this.width).fill('placeholder').map(ele => []))
  },

  randomize() {
    let randomBoard = this.applyState(new Array(this.width).fill('placeholder')
    .map(ele => new Array(this.height).fill('placeholder')
    .map(ele => Math.random() < 0.5)
    ))
    this.applyState(randomBoard)
  },
};

gameOfLife.createAndShowBoard();

//1.) assign click handler to all cells: get a cell, reduce neighbords, apply next state
//2.) compute the next step
//3.) apply state
//4.) clear the board
//5.) assign step to interval
//6.) randomize
