import { Field, GameMaker, Player } from "./modules/reversi";

// フィールドを描画
const fieldElement = document.querySelector(".field");
const field = new Field(fieldElement);

// プレイヤーを生成
const player1 = new Player("black", field);
const player2 = new Player("white", field);

// フィールドにプレイヤーを設定
field.setPlayers(player1, player2);

const game = new GameMaker(field);
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", game.startGame);
startButton.disabled = false;
const skipButton = document.querySelector("#skip-button");
skipButton.disabled = true;
