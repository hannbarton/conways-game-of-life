class Main {
  constructor(container) {
    this.container = container;
    this.cells = [];

    // Create Game of Life instance
    this.board = new Board(25, 20);

    // Create Table
    this.createTable();
    
    // Add event Listeners
    document.getElementById("board").addEventListener("click", this.handleToggleCell.bind(this));
    document.getElementById("step_btn").addEventListener("click", this.handleStep.bind(this));
    document.getElementById("play_btn").addEventListener("click", this.handlePlay.bind(this));
    document.getElementById("reset_btn").addEventListener("click", this.handleReset.bind(this));
    document.getElementById("clear_btn").addEventListener("click", this.handleClear.bind(this));
  }

  createTable() {
    const table = document.createElement("tbody");
    for (let h = 0; h < 20; h++) {
      const tr = document.createElement("tr");
      for (let w = 0; w < 25; w++) {
        const td = document.createElement("td");
        td.dataset.row = h;
        td.dataset.col = w;
        this.cells.push(td);
        tr.append(td);
      }
      table.append(tr);
    }
    this.container.append(table);
  }
  
  paint() {
    this.cells.forEach(td => {
      const cellValue = this.board.getCell(td.dataset.row, td.dataset.col);
      if (cellValue === 1) {
        td.classList.add("alive");
      } else {
        td.classList.remove("alive");
      }
    });
  }

  handleToggleCell(event) {
    console.log("click")
    this.board.toggleCell(event.target.dataset.row, event.target.dataset.col);
    this.paint();
  }

  handleStep() {
    this.board.step();
    this.paint();
  }

  handlePlay() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.board.step();
        this.paint();
      }, 100);
    } else {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  handleReset() {
    this.board.forEachCell((row, col) => {
      this.board.setCell(Math.round(Math.random()), row, col);
    })
    this.paint();
  }

  handleClear() {
    this.board.forEachCell((row, col) => {
      this.board.setCell(0, row, col);
    })
  
    this.paint();
  }
}


new Main(document.getElementById("board"));