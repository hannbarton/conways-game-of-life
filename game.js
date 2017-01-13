/*********** ES6 Concepts ***********
 * const
 * template literals
 * Array.from()
 *************************************/

const gameOfLife = {
    width: 12,
    height: 12, // width and height dimensions of the board
    stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

    // Utility functions
    forEachCell: function(iteratorFunc) {
        // es6 Array.from() creates a new Array from an iterable : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        Array.from(document.getElementsByTagName('td')).forEach(cell => {
            const coords = this.getCoordsOfCell(cell);
            iteratorFunc(cell, coords[0], coords[1]);
        })
    },
    getCoordsOfCell: function(cell) {
        const idSplit = cell.id.split('-'); // ['0', '0']

        // es6 Arrow Functions are lexical in scope : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
          // Lexical Scoping defines how variable names are resolved in nested functions: inner functions contain the scope of parent functions even if the parent function has returned.
        // `+` before a string we can coerce a string into a number
        return idSplit.map(str => +str)
    },
    getCellStatus: function(cell) {
        return cell.getAttribute('data-status');
    },
    setCellStatus: function(cell, status) {
        cell.className = status;
        return cell.setAttribute('data-status', status)
    },
    toggleCellStatus: function(cell) {

        if (this.getCellStatus(cell) == 'dead') {
            this.setCellStatus(cell, "alive");
        } else {
            this.setCellStatus(cell, "dead");
        }
    },
    getNeighbors: function (cell) {
        const neighbors = [];
        const [cellX, cellY] = this.getCoordsOfCell(cell);
        for (let i = cellX - 1; i <= cellX + 1; i++) {
            for (let j = cellY - 1; j <= cellY + 1; j++) {
                if (i === cellX && j === cellY) continue;
                neighbors.push(document.getElementById(`${i}-${j}`));
            }
        }
        return neighbors.filter(neighbor => neighbor);
    },
    getAliveNeighbors: function (cell) {
        var allNeighbors = this.getNeighbors(cell);
        return allNeighbors.filter(neighbor => this.getCellStatus(neighbor) === "alive");
    },

    // Game
    createAndShowBoard: function() {
        // create <table> element
        const goltable = document.createElement("tbody");

        // build Table HTML
        let tablehtml = '';
        for (let h = 0; h < this.height; h++) {

            // es6 Template Literals allow embedded expressions : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
            tablehtml += `<tr id='row+${h}'>`;
            for (let w = 0; w < this.width; w++) {
                tablehtml += `<td data-status='dead' id='${w}-${h}'></td>`;
            }
            tablehtml += "</tr>";
        }
        goltable.innerHTML = tablehtml;

        // add table to the #board element
        const board = document.getElementById('board');
        board.appendChild(goltable);

        // once html elements are added to the page, attach events to them
        this.setupBoardEvents();
    },
    setupBoardEvents: function() {
        // This function sets ups events for the entire board. Specifically onClick events for each cell


        // using Event Delegation we can set one onClick handler that bubbles up, and we can tell what was clicked by looking at e.target
        const onCellClick = e => this.toggleCellStatus(e.target);

        // if attaching click handler to board (event delegation!):
        document.getElementById('board').onclick = onCellClick;

        // Buttons
        document.getElementById("step_btn").onclick = () => this.step();
        document.getElementById("clear_btn").onclick= () => this.clearBoard();
        document.getElementById("reset_btn").onclick = () => this.resetRandom();
        document.getElementById("play_btn").onclick = () => this.enableAutoPlay();

    },
    step: function() {
        // Logic for each step
        // We 
        const cellsToToggle = [];
        this.forEachCell((cell, x, y) => {
            var countLiveNeighbors = this.getAliveNeighbors(cell).length;

            if (this.getCellStatus(cell) === "alive") {
                if (countLiveNeighbors !== 2 && countLiveNeighbors !== 3) {
                    cellsToToggle.push(cell);
                }
            } else {
                if (countLiveNeighbors === 3) {
                    cellsToToggle.push(cell);
                }
            }
        })

        cellsToToggle.forEach((cellToToggle) => this.toggleCellStatus(cellToToggle))
    },
    clearBoard: function() {
        // var gameOfLifeObj = this;
        this.forEachCell(function(cell) {
            this.setCellStatus(cell, "dead");
        }.bind(this));
    },
    resetRandom: function() {
        this.forEachCell(function(cell) {
            if (Math.random() > .5) {
                this.setCellStatus(cell, 'alive');
            } else {
                this.setCellStatus(cell, 'dead');
            }
        }.bind(this))
    },
    enableAutoPlay: function() {
        // Start Auto-Play by running the 'step' function
        // automatically repeatedly every fixed time interval
        if (this.stepInterval) {
            return this.stopAutoPlay();
        }
        this.stepInterval = setInterval(this.step.bind(this), 500);
    },
    stopAutoPlay: function() {
        clearInterval(this.stepInterval);
        this.stepInterval = null;
    }

};

gameOfLife.createAndShowBoard();
