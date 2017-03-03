var gameOfLife = {
  
  width: 12, 
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {
    
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },
  //Get cell and attach row/col props so it doesn't get lost/mutated
  getCell: function(row, col) {
    var theCell = document.getElementById(col+'-'+row)
    theCell.col = col;
    theCell.row = row;
    return theCell;
  },

  forEachCell: function (iteratorFunc) { 
    for(var col = 0; col < this.width; col++) {
      for(var row = 0; row < this.height; row++) {
        var theCell = this.getCell(row, col)
        iteratorFunc(theCell, row, col)
      }
    }
  },
  
  setupBoardEvents: function() {
    var onCellClick = function (e) {
    
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
      
    };
    
    window.board.addEventListener('click', e => onCellClick.call(e.target, e))
    window.step_btn.addEventListener('click', e => this.step())
  },

  step: function () {
    var nextState = new Array(this.width).fill('').map(el => []);

    this.forEachCell((cell, row, col) => {
      var theStatus = (cell.dataset.status === 'alive');
      nextState[col][row] = !theStatus;
    })

    console.table(nextState)
    
    this.forEachCell((cell, row, col) => {
      var theStatus = nextState[col][row] ? 'alive' : 'dead';
      cell.className = theStatus;
      cell.dataset.status = theStatus;
    })

  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval  
  }
  
};

gameOfLife.createAndShowBoard();
