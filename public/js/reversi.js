
let fieldCells = document.querySelectorAll("td");
let cellMatrix = [];
let cellsCanPutBefore;
let cellsCanPut;
let cPos;
let rPos;
let nowStone = "○";
let message = document.getElementById("message");
let stoneCount = {
    "white": 0,
    "black": 0,
    "none": 0
}
let startButton = document.getElementById("startButton");
let passButton = document.createElement("input");
passButton.setAttribute("id", "passButton");
passButton.setAttribute("type", "button");
passButton.setAttribute("value", "パスする");
passButton.setAttribute("onclick", "passTurn()");
passButton.disabled = true;
let form = document.getElementsByClassName("form");

// 空のフィールド変数を作成
for (r = 0; r < 8; r++) {
    cellMatrix.push([]);
};

// テーブルの各セルを二次元配列に格納
for (let i = 0; i < fieldCells.length; i++) {
    cPos = i % 8;
    rPos = Math.floor(i / 8);
    cellMatrix[rPos][cPos] = fieldCells[i];
    cellMatrix[rPos][cPos].setAttribute("id", String(rPos) + "_" + String(cPos));
};

// マウスオーバ処理
function highlight(cell) {
    cell.target.textContent = nowStone;
    cell.target.style.background = "lightpink";
    cell.target.style.borderWidth = "5px";
};
function resetHighlight(cell) {
    cell.target.textContent = "";
    cell.target.style.background = "silver";
    cell.target.style.borderWidth = "1px";
};

function countStonesOnField() {
    stoneCount.white = 0
    stoneCount.black = 0
    stoneCount.none = 0
    for (c of fieldCells) {
        switch (c.textContent) {
            case "○":
                stoneCount.white += 1
                break;
            case "●":
                stoneCount.black += 1
                break;
            case "":
                stoneCount.none += 1
                break;
        }
    }
}
function judgeResult() {
    passButton.remove();
    if (stoneCount.white > stoneCount.black) {
        message.textContent = "○ の勝利です"
    } else if (stoneCount.white < stoneCount.black) {
        message.textContent = "● の勝利です"
    } else if (stoneCount.white === stoneCount.black) {
        message.textContent = "引き分けです"
    }
    startButton.disabled = false;
    startButton.textContent = "もう一度始める"
}

// 石配置処理
function putStone(cell) {
    for (let c of cellsCanPut) {
        c.style.background = "white"
        c.removeEventListener("mouseover", highlight);
        c.removeEventListener("mouseleave", resetHighlight);
        c.removeEventListener("click", putStone);
    }
    cell.target.style.background = "white";
    cell.target.style.borderWidth = "1px";
    cell.target.textContent = nowStone;
    turnOverStones(cell.target);
    countStonesOnField()
    toggleTurn();
    checkCellsCanPutStone();
    if (cellsCanPutBefore === cellsCanPut === 0 || stoneCount.none === 0) {
        judgeResult();
    }
};

function passTurn() {
    toggleTurn();
    checkCellsCanPutStone();
    if (cellsCanPutBefore === cellsCanPut === 0 || stoneCount.none === 0) {
        judgeResult();
    }
}

function getAnotherStone(stone) {
    switch (stone) {
        case "●":
            stone = "○";
            break;
        case "○":
            stone = "●";
            break;
        default:
            throw new Error("石がありません");
    };
    return stone;
};

function toggleTurn() {
    nowStone = getAnotherStone(nowStone);
    message.textContent = `現在の石は ${nowStone} です`;
};

function selectCellsAround(cell, condition) {
    let cells = [];
    let pos = cell.id.split("_").map((v) => { return Number(v) });
    let rPos = pos[0];
    let cPos = pos[1];
    for (let r = rPos - 1; r <= rPos + 1; r++) {
        if (r < 0 || r > 7) {
            continue;
        }
        for (let c = cPos - 1; c <= cPos + 1; c++) {
            if (c < 0 || c > 7) {
                continue;
            };
            if (c === cPos && r === rPos) {
                continue;
            };
            switch (condition) {
                case 'none':
                    if (cellMatrix[r][c].textContent === '') {
                        cells.push(cellMatrix[r][c]);
                    }
                    break;
                case 'same':
                    if (cellMatrix[r][c].textContent === nowStone) {
                        cells.push(cellMatrix[r][c]);
                    }
                    break;
                case 'another':
                    if (cellMatrix[r][c].textContent === getAnotherStone(nowStone)) {
                        cells.push(cellMatrix[r][c]);
                    }
                    break;
                default:
                    cells.push(cellMatrix[r][c]);
            }
        };
    };
    return cells;
}

function selectCellsOnAnotherStoneInFIeld() {
    let cell;
    let cells = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (cellMatrix[r][c].textContent === getAnotherStone(nowStone)) {
                cell = cellMatrix[r][c];
                cells.push(cell);
            };
        };
    };
    return cells;
};

function selectEmptyCellsAround(cells) {
    let emptyCellsAround = new Set();
    let cellsAround;
    for (let c of cells) {
        cellsAround = selectCellsAround(c, 'none');
        for (let c2 of cellsAround) {
            emptyCellsAround.add(c2);
        };
    };
    emptyCellsAround = Array.from(emptyCellsAround);
    return emptyCellsAround;
};

function getPosDiff(n1, n2) {
    let n1Pos = n1.id.split("_").map((v) => { return Number(v) });
    let n2Pos = n2.id.split("_").map((v) => { return Number(v) });
    let rMove = n2Pos[0] - n1Pos[0];
    let cMove = n2Pos[1] - n1Pos[1];
    let posDiff = [rMove, cMove]
    return posDiff
}

function moveCell(fromCell, posDiff) {
    let pos = fromCell.id.split("_").map((v) => { return Number(v) });
    let rPos = pos[0];
    let cPos = pos[1];
    let rPosMoved = rPos + posDiff[0]
    let cPosMoved = cPos + posDiff[1]
    let movedCell;
    if ((rPosMoved >= 0) && (rPosMoved <= 7) && (cPosMoved >= 0) && (cPosMoved <= 7)) {
        movedCell = cellMatrix[rPosMoved][cPosMoved];
    } else {
        movedCell = null
    }
    return movedCell;
}

function checkDirectionCanPutStone(fromCell, posDiff) {
    let canPutStone;
    let to = moveCell(fromCell, posDiff);
    if (to === null) {
        canPutStone = false;
    } else {
        switch (to.textContent) {
            case nowStone:
                canPutStone = true;
                break;
            case getAnotherStone(nowStone):
                canPutStone = checkDirectionCanPutStone(to, posDiff);
                break;
            case '':
                canPutStone = false;
                break;
            default:
                console.error('石の状態がおかしいです')
        }
    }
    return canPutStone;
}

function selectCellsCanPutStoneOppositeSide(cells) {
    let cellsCanPutStoneOppositeSide = new Set();
    let cellsAroundOnAnotherStone;
    for (let f of cells) {
        cellsAroundOnAnotherStone = selectCellsAround(f, 'another');
        for (let t of cellsAroundOnAnotherStone) {
            posDiff = getPosDiff(f, t);
            canPutStoneOppositeSide = checkDirectionCanPutStone(f, posDiff);
            if (canPutStoneOppositeSide) {
                cellsCanPutStoneOppositeSide.add(f);
            }
        }
    }
    cellsCanPutStoneOppositeSide = Array.from(cellsCanPutStoneOppositeSide);
    return cellsCanPutStoneOppositeSide;
};

function walkTurnOverStone(fromCell, posDiff) {
    let movedCell = moveCell(fromCell, posDiff);
    if (movedCell === null) {
        return;
    }
    switch (movedCell.textContent) {
        case nowStone:
            break;
        case getAnotherStone(nowStone):
            movedCell.textContent = nowStone;
            walkTurnOverStone(movedCell, posDiff);
            break;
    }
}

function turnOverStones(cell) {
    let from = cell;
    let cells = selectCellsAround(from, 'another');
    let canPut;
    let posDiff;
    for (to of cells) {
        posDiff = getPosDiff(from, to);
        canPut = checkDirectionCanPutStone(from, posDiff);
        if (canPut) {
            walkTurnOverStone(from, posDiff);
        }
    }
};

function checkCellsCanPutStone() {
    let cells = selectCellsOnAnotherStoneInFIeld();
    cells = selectEmptyCellsAround(cells);
    cellsCanPutBefore = cellsCanPut;
    cellsCanPut = selectCellsCanPutStoneOppositeSide(cells)
    if (cellsCanPut.length > 0) {
        for (let c of cellsCanPut) {
            c.style.background = "silver"
            c.addEventListener("mouseover", highlight);
            c.addEventListener("mouseleave", resetHighlight);
            c.addEventListener("click", putStone);
        };
    } else if (cellsCanPut.length === 0) {
        passButton.disabled = false;
    }
};

function initializeField() {
    let pos;
    let rPos;
    let cPos;
    for (c of fieldCells) {
        pos = c.id.split("_").map((v) => { return Number(v) });
        rPos = pos[0];
        cPos = pos[1];
        if ((rPos === 3 && cPos === 3) || (rPos === 4 && cPos === 4)) {
            c.textContent = "○"
        } else if ((rPos === 3 && cPos === 4) || (rPos === 4 && cPos === 3)) {
            c.textContent = "●"
        } else {
            c.textContent = ""
        }
    }
}

// ゲーム開始
function startGame() {
    startButton.disabled = true;
    form[0].appendChild(passButton);
    message.textContent = `現在の石は ${nowStone} です`;
    initializeField();
    countStonesOnField();
    checkCellsCanPutStone();
};
