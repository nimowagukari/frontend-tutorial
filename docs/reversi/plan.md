## クラスごとの責務

- Field
  - 盤面に関する値の保持
    - 盤面のサイズ(行 × 列)
    - 盤面を表す HTMLDivElement
    - セルの状態
  - 盤面を主体とする処理
  - 盤面のマウスオーバ、クリック時の挙動の実装
- Player
  - プレイヤーに関する値の保持
    - 石の色
  - プレイヤーを主体とする処理
- GameMaker
  - ゲームに関する値の保持
    - Field
    - Player
    - 現在の Player
  - ゲームを主体とする処理
    - ゲームの進行及び管理
      - プレイヤーごとの手番の管理
      - スキップの判定
      - ゲームの終了判定

## クラス図

```mermaid
classDiagram
  class Field{
    +Number rowCount
    +Number columnCount
    +Object stoneCount
    +HTMLDivElement fieldElement
    +HTMLDivElement initializedCell
    +HTMLDivElement stone
    +HTMLDivElement whiteStone
    +HTMLDivElement blackStone
    +Player player1
    +Player player2
    +Player currentPlayer
    +GameMaker gameMaker

    +constructor(fieldElement: HTMLDivElement) undefined
    +setPlayers(player1: Player, player2: Player) undefined
    +setGameMaker(gameMaker: GameMaker) undefined
    +initializeCell() undefined
    +getCellsCanPut() HTMLDivElement[]
    +putStone(cell: HTMLDivElement) undefined
    +addEvents(cells: HTMLDivElement[]) undefined
    +skip() undefined
    +updateStoneCount() undefined

    -getCellByRowAndColumn(row: Number, column: Number) HTMLDivElement
    -selectOpponentCells(cells: HTMLDivElement[]) HTMLDivElement[]
    -getAroundCells(HTMLDivElement) HTMLDivElement[]
    -selectEmptyCells(cells: HTMLDivElement[]) HTMLDivElement[]
    -getCellPositionDiff(cellFrom: Number, cellTo: Number) Number[]
    -canPlaceStone(cell: HTMLDivElement, positionDiff: Number[]) bool
    -selectCellsCanFlipStone(cells: HTMLDivElement) HTMLDivElement[]
    -togglePlayer(player: Player) Player
    -flipStonesInDirection(cellFrom: HTMLDivElement, positionDiff: Number[]) undefined
    -removeEvents() undefined
}

  class Player{
    +String stoneColor
    +field Field

    +constructor(stoneColor: string, field: Field) undefined
    +putStone(element: HTMLDivElement) undefined
    +skip() undefined
  }

  class GameMaker{
    +Field field
    +Player[] players
    +Player currentPlayer
    +constructor(field: Field, ...players: Player[]) undefined
    +startGame() undefined
    -updateCellEvent(cells: HTMLDivElement[])
    +togglePlayer(player: Player) Player
  }

  Field --o Player
  Field --o GameMaker
  Player --o Field
  GameMaker --o Player
  GameMaker --o Field
```
