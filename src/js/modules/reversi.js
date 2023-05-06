export class Field {
  constructor(fieldElement) {
    this.rowCount = 8;
    this.columnCount = 8;
    this.stoneCount = {
      white: 0,
      black: 0,
      none: 0,
    };
    this.fieldElement = fieldElement;

    this.initializedCell = document.createElement("div");
    this.initializedCell.classList.add("cell");

    this.stone = document.createElement("div");
    this.stone.classList.add("stone");
    this.whiteStone = this.stone.cloneNode(true);
    this.whiteStone.classList.add("white");
    this.whiteStone.dataset.stoneColor = "white";
    this.blackStone = this.stone.cloneNode(true);
    this.blackStone.classList.add("black");
    this.blackStone.dataset.stoneColor = "black";

    this.initializeCell = this.initializeCell.bind(this);

    this.initializeCell();
    this.updateStoneCount();
  }

  setPlayers(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
  }

  setGameMaker(gameMaker) {
    this.gameMaker = gameMaker;
  }

  initializeCell() {
    while (this.fieldElement.firstChild) {
      this.fieldElement.removeChild(this.fieldElement.firstChild);
    }

    for (let r = 0; r < this.rowCount; r++) {
      for (let c = 0; c < this.columnCount; c++) {
        let cell = this.initializedCell.cloneNode(true);
        cell.dataset.row = r;
        cell.dataset.column = c;
        switch (true) {
          case (r == 3 && c == 3) || (r == 4 && c == 4):
            cell.appendChild(this.whiteStone.cloneNode(true));
            break;
          case (r == 3 && c == 4) || (r == 4 && c == 3):
            cell.appendChild(this.blackStone.cloneNode(true));
            break;
        }
        this.fieldElement.appendChild(cell);
      }
    }

    const startButton = document.querySelector("#start-button");
    startButton.disabled = true;
  }

  getCellsCanPut() {
    let cells = document.querySelectorAll(".cell");
    cells = [].map.call(cells, (cell) => {
      return cell;
    });
    cells = this.#selectOpponentCells(cells);
    cells = cells
      .map((cell) => {
        return this.#getAroundCells(cell);
      })
      .flat();
    cells = this.#selectEmptyCells(cells);
    cells = this.#selectCellsCanFlipStone(cells);
    return cells;
  }
  #getCellByRowAndColumn(row, column) {
    return document.querySelector(
      ".cell[data-row='" + row + "'][data-column='" + column + "']"
    );
  }
  #selectOpponentCells(cells) {
    return cells.filter((cell) => {
      return (
        cell.hasChildNodes() &&
        cell.childNodes[0].dataset.stoneColor ===
          this.#togglePlayer(this.currentPlayer).stoneColor
      );
    });
  }
  #getAroundCells(cell) {
    const row = Number(cell.dataset.row);
    const rows = [row - 1, row, row + 1].filter((r) => {
      return r >= 0 && r < this.rowCount;
    });
    const column = Number(cell.dataset.column);
    const columns = [column - 1, column, column + 1].filter((c) => {
      return c >= 0 && c < this.columnCount;
    });
    let cellsAround = [];
    for (const r of rows) {
      for (const c of columns) {
        if (r !== row || c !== column) {
          cellsAround.push(this.#getCellByRowAndColumn(r, c));
        }
      }
    }
    return cellsAround;
  }
  #selectEmptyCells(cells) {
    return cells.filter((cell) => {
      return cell.hasChildNodes() === false;
    });
  }
  #getCellPositionDiff(cellFrom, cellTo) {
    const rowFrom = cellFrom.dataset.row;
    const columnFrom = cellFrom.dataset.column;
    const rowTo = cellTo.dataset.row;
    const columnTo = cellTo.dataset.column;
    const rowDiff = rowTo - rowFrom;
    const columnDiff = columnTo - columnFrom;
    const positionDiff = [rowDiff, columnDiff];
    return positionDiff;
  }
  #canPlaceStone(cell, positionDiff) {
    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);
    const nextCell = this.#getCellByRowAndColumn(
      row + positionDiff[0],
      column + positionDiff[1]
    );
    if (nextCell !== null && nextCell.hasChildNodes()) {
      if (
        nextCell.childNodes[0].dataset.stoneColor ===
        this.currentPlayer.stoneColor
      ) {
        return true;
      } else {
        return this.#canPlaceStone(nextCell, positionDiff);
      }
    } else {
      return false;
    }
  }
  #selectCellsCanFlipStone(cells) {
    let cellsCanPut = [];
    for (const cell of cells) {
      const cellsAround = this.#getAroundCells(cell);
      const opponentsCells = this.#selectOpponentCells(cellsAround);
      for (const cell2 of opponentsCells) {
        const positionDiff = this.#getCellPositionDiff(cell, cell2);
        const canPut = this.#canPlaceStone(cell, positionDiff);
        if (canPut) {
          cellsCanPut.push(cell);
        }
      }
    }
    return cellsCanPut;
  }
  #togglePlayer(player) {
    if (player === this.player1) {
      player = this.player2;
    } else if (player === this.player2) {
      player = this.player1;
    }
    return player;
  }
  putStone(cell) {
    // イベントを削除
    this.#removeEvents();

    // 石を配置
    if (this.currentPlayer.stoneColor === "white") {
      cell.appendChild(this.whiteStone.cloneNode(true));
    } else if (this.currentPlayer.stoneColor === "black") {
      cell.appendChild(this.blackStone.cloneNode(true));
    }

    // 間の石をひっくり返す
    let cells = this.#getAroundCells(cell);
    cells = this.#selectOpponentCells(cells);
    for (const c of cells) {
      const positionDiff = this.#getCellPositionDiff(cell, c);
      if (this.#canPlaceStone(cell, positionDiff)) {
        this.#flipStonesInDirection(cell, positionDiff);
      }
    }

    // 石の個数情報を最新化＆終了判定
    this.updateStoneCount();

    const startButton = document.querySelector("#start-button");
    switch (0) {
      case this.stoneCount.none:
      case this.stoneCount.white:
      case this.stoneCount.black:
        this.gameMaker.judgeWinner();
        startButton.disabled = false;
        startButton.textContent = "もう一度始める";
        startButton.addEventListener("click", this.gameMaker.restartGame);
        return;
    }

    // 次のプレイヤーのイベントを付与
    this.currentPlayer = this.#togglePlayer(this.currentPlayer);
    const cellsCanPut = this.getCellsCanPut();
    if (cellsCanPut.length === 0) {
      const skipButton = document.querySelector("#skip-button");
      skipButton.disabled = false;
    } else {
      this.addEvents(cellsCanPut);
    }

    this.gameMaker.render();
  }
  #flipStonesInDirection(cellFrom, positionDiff) {
    const nextCell = this.#getCellByRowAndColumn(
      Number(cellFrom.dataset.row) + positionDiff[0],
      Number(cellFrom.dataset.column) + positionDiff[1]
    );
    const opponentStoneColor = this.#togglePlayer(
      this.currentPlayer
    ).stoneColor;
    if (nextCell.childNodes[0].dataset.stoneColor === opponentStoneColor) {
      nextCell.childNodes[0].classList.remove(opponentStoneColor);
      nextCell.childNodes[0].classList.add(this.currentPlayer.stoneColor);
      nextCell.childNodes[0].dataset.stoneColor = this.currentPlayer.stoneColor;
      this.#flipStonesInDirection(nextCell, positionDiff);
    }
  }
  #removeEvents() {
    const cellsCanPut = this.getCellsCanPut();
    for (const c of cellsCanPut) {
      c.classList.remove("can-put");
      c.removeEventListener("click", this.currentPlayer.putStone);
    }
  }
  addEvents(cells) {
    const cellsCanPut = cells;
    for (const c of cellsCanPut) {
      c.classList.add("can-put");
      c.addEventListener("click", this.currentPlayer.putStone);
    }
  }
  skip() {
    this.currentPlayer = this.#togglePlayer(this.currentPlayer);
    this.gameMaker.render();
    const cellsCanPut = this.getCellsCanPut();
    this.addEvents(cellsCanPut);
    const skipButton = document.querySelector("#skip-button");
    skipButton.disabled = true;
  }
  updateStoneCount() {
    let stoneCount = {
      white: 0,
      black: 0,
      none: 0,
    };
    let cells = document.querySelectorAll(".cell");

    cells = [].map.call(cells, (cell) => {
      return cell;
    });
    for (let c of cells) {
      if (c.hasChildNodes()) {
        switch (c.childNodes[0].dataset.stoneColor) {
          case "white":
            stoneCount.white++;
            break;
          case "black":
            stoneCount.black++;
            break;
        }
      } else {
        stoneCount.none++;
      }
    }
    this.stoneCount.white = stoneCount.white;
    this.stoneCount.black = stoneCount.black;
    this.stoneCount.none = stoneCount.none;
  }
}

export class Player {
  constructor(stoneColor, field) {
    this.stoneColor = stoneColor;
    this.field = field;
    this.putStone = this.putStone.bind(this);
    this.skip = this.skip.bind(this);
  }

  putStone(element) {
    this.field.putStone(element.target);
  }

  skip() {
    this.field.skip();
  }
}

export class GameMaker {
  constructor(field) {
    this.field = field;
    this.currentPlayer = this.field.currentPlayer;
    this.field.setGameMaker(this);
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  startGame() {
    // ボタン表示を追加・更新
    const startButton = document.querySelector("#start-button");
    startButton.disabled = true;
    const skipButton = document.querySelector("#skip-button");
    skipButton.classList.remove("hidden");
    skipButton.addEventListener("click", this.currentPlayer.skip);

    this.render();
    // プレイヤーが石を置けるセルを特定
    let cellsCanPut = this.field.getCellsCanPut();
    // 現在のプレイヤーに応じてイベントを設定
    this.field.addEvents(cellsCanPut);
  }

  restartGame() {
    this.field.initializeCell();
    this.field.currentPlayer = this.field.player1;
    this.startGame();
  }

  render() {
    const message = document.querySelector("#message");
    this.currentPlayer = this.field.currentPlayer;

    switch (this.currentPlayer.stoneColor) {
      case "white":
        message.textContent = "白の手番です";
        break;
      case "black":
        message.textContent = "黒の手番です";
        break;
    }
  }

  judgeWinner() {
    const message = document.querySelector("#message");
    if (this.field.stoneCount.white > this.field.stoneCount.black) {
      message.textContent = "白の勝利です";
    } else if (this.field.stoneCount.white < this.field.stoneCount.black) {
      message.textContent = "黒の勝利です";
    } else {
      message.textContent = "引き分けです";
    }
  }
}
