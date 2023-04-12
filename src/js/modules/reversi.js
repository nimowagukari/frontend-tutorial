export class Field {
  constructor(fieldElement) {
    this.fieldElement = fieldElement;
    this.rowCount = 8;
    this.columnCount = 8;
  }

  initializeCell() {
    while (this.fieldElement.firstChild) {
      this.fieldElement.removeChild(this.fieldElement.firstChild);
    }

    const initializedCell = document.createElement("div");
    initializedCell.classList.add("cell");
    const stone = document.createElement("div");
    stone.classList.add("stone");
    const whiteStone = stone.cloneNode(true);
    whiteStone.classList.add("white");
    const blackStone = stone.cloneNode(true);
    blackStone.classList.add("black");
    for (let r = 0; r < this.rowCount; r++) {
      for (let c = 0; c < this.columnCount; c++) {
        let cell = initializedCell.cloneNode(true);
        cell.dataset.row = r;
        cell.dataset.column = c;
        switch (true) {
          case (r == 3 && c == 3) || (r == 4 && c == 4):
            cell.appendChild(whiteStone.cloneNode(true));
            break;
          case (r == 3 && c == 4) || (r == 4 && c == 3):
            cell.appendChild(blackStone.cloneNode(true));
            break;
        }
        this.fieldElement.appendChild(cell);
      }
    }
  }

  getCellsCanPut() {
    //
  }
  // #filterCellsWithCondition(cells = this.fieldElement.childNodes, condition) {
  //   let filterdCells;
  //   for (const c in condition) {
  //     switch (c) {
  //       case "placed":
  //         break;
  //       case "stoneColor":
  //         break;

  //       default:
  //         break;
  //     }
  //   }
  // }
  // #isStonePlaced(){

  // }
  // #whatColor() {

  // }
}

export class Player {
  constructor(stoneColor) {
    this.stoneColor = stoneColor;
  }

  putStone(cellElement) {
    console.log(cellElement);
  }
}

export class GameMaker {
  constructor(field, player1, player2) {
    this.field = field;
    this.players = [player1, player2];
    this.currentPlayer = this.#togglePlayer();
    console.log(this.players);
    console.log(this.currentPlayer.stoneColor);
    this.currentPlayer = this.#togglePlayer();
    console.log(this.currentPlayer.stoneColor);
  }

  startGame() {
    // 現在のプレイヤーを設定
    // updateCellEvent：現在のプレイヤーに応じてイベントを設定
  }
  #updateCellEvent() {
    // プレイヤーが石を置けるセルを特定
    let cellsCanPut = this.field.getCellsCanPut();
    // 対象のセルにイベントを設定
    for (const cell of cellsCanPut) {
      console.log(cell);
    }
  }
  #togglePlayer() {
    const c = this.players.length;
    function* playerGenerator() {
      let i = 0;
      while (true) {
        let k = i % c;
        yield this.players[k];
        i++;
      }
    }
    return playerGenerator();
  }
}
