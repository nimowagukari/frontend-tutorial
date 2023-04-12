import { Field, GameMaker, Player } from "./modules/reversi";

// フィールドを描画
const fieldElement = document.querySelector(".field");
const field = new Field(fieldElement);
field.initializeCell();

const player1 = new Player("white");
const player2 = new Player("black");

const game = new GameMaker(field, player1, player2);
game.startGame();
