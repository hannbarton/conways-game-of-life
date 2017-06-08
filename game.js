var mainElement = document.getElementById('main')
if (mainElement) {
  var game = new GameOfLife(mainElement)

  // Connect #step_btn to the step function
  document.getElementById('step_btn')
    .addEventListener('click', game.step)

  document.getElementById('play_btn')
    .addEventListener('click', game.togglePlaying)

  document.getElementById('clear_btn')
    .addEventListener('click', game.clear)

  document.getElementById('reset_btn')
    .addEventListener('click', game.random)
}

function GameOfLife(container, width=64, height=64) {  
  // Create boards for the present and future.
  // Game boards are somewhat expensive to create, so we're going
  // to be reusing them. After we advance the game one step, `future`
  // will become `present` and vice versa.
  var present = new Board(width, height);
  var future = new Board(width, height);

  // Create a <table> to hold our cells.
  var table = createTable();
  
  // Put the table in our container
  container.appendChild(table);

  // Add a tap listener to our table
  table.addEventListener('mousedown', toggleCellFromEvent)

  function createTable() {
    // create <table> element
    var table = document.createElement('table');       // <table
    table.classList.add('board')                       //   class='board'>
    table.cells = []
    for (var r = 0; r < height; r++) {
      var tr = document.createElement('tr');           //   <tr>
      for (var c = 0; c < width; c++) {                //     For instance, at r=2, c=3:
        var td = document.createElement('td');         //     <td
        td.id = `${r}-${c}`                            //       id="2-3">
        // We'll put the coordinate on the cell
        // Element itself, letting us fetch them
        // in a click listener later.
        td.coord = [r, c];        
        tr.appendChild(td);                            //     </td>
        table.cells.push(td)
      }
      table.appendChild(tr);                           //   </tr>
    }                                                  //  </table>
    return table    
  }
  
  function toggleCellFromEvent(event) {
    // FIXME: This currently always toggles cell (0, 0).
    // How do we get the of the cell that was clicked on?
    // HINT: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    var cell = event.target//document.getElementById('0-0'); // ⬅️ Fix me

    present.toggle(cell.coord)
    paint()
  }

  function paint() {
    // TODO:
    //   1. For each <td>:
    //     a. If present.cells[cell.coord] is true, give the <td> the `alive` css class
    //     b. Otherwise, give it the `dead` class
    //
    // HINT:
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
    table.cells
      .forEach(td => present.get(td.coord) ? td.classList.add('alive') : td.classList.remove('alive'))
  }

  function step(rules) {
    // You need to write tick in board.js    
    tick(present, future, rules)
    
    // Swap the present and future boards
    // (The future board is now the present, and we'll re-use the present
    // board for the next step).
    var temp = present
    present = future
    future = temp

    // Paint the new present
    paint()
  }

  let interval
  function play() {
    // TODO:
    // Start Auto-Play by running the `step` function
    // automatically repeatedly every fixed time interval
    
    // HINT:
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
    interval = setInterval(step, 32)
  }

  function stop() {
    // TODO: Stop autoplay.
    interval && clearInterval(interval)
    interval = null
    // HINT:
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
  }

  function togglePlaying() {
    // TODO: If we're playing, stop. Otherwise, start playing.
    interval ? stop() : play()
  }

  function clear() {
    step(() => false)
  }

  function random() {
    step(() => Math.random() <= 0.5)
  }

  return {play, step, stop, togglePlaying, clear, random}
};
