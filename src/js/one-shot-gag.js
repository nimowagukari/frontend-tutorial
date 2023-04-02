async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // (utf-8 の) Uint8Array にエンコードする
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // メッセージをハッシュする
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファーをバイト列に変換する
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // バイト列を16進文字列に変換する
  return hashHex;
}

function Judger(laughtCharacters, passThreshold, node) {
  this.laughtCharacters = laughtCharacters;
  this.passThreshold = passThreshold;
  this.node = node;
  this.waitingSec = Math.random() * 5000;
}

Judger.prototype.judge = async function (gagHashHex) {
  // 結果の初期化
  this.node.removeAttribute("class");
  this.node.textContent = "審査中…";

  const gagHashLength = gagHashHex.length;
  const re = new RegExp(`[${this.laughtCharacters}]`, "g");
  const gagHashMatchLength = gagHashHex.match(re).length;

  // console.log(
  //   `${gagHashMatchLength} / ${gagHashLength} = ${
  //     gagHashMatchLength / gagHashLength
  //   }`
  // );
  const result = this.passThreshold <= gagHashMatchLength / gagHashLength;
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log(result);
      // console.log(`${this.waitingSec} msec waited`);
      if (result) {
        this.node.setAttribute("class", "pass");
        this.node.textContent = "合格";
      } else {
        this.node.setAttribute("class", "failure");
        this.node.textContent = "不合格";
      }
      resolve(result);
    }, this.waitingSec);
  });
};

async function showGag(e) {
  const gagText = document.querySelector("#gagText").value;
  const resultText = document.querySelector("#result");
  const gagHashHex = await digestMessage(gagText);

  resultText.removeAttribute("class");
  resultText.textContent = "";

  judgeResult = await Promise.all([
    judger1.judge(gagHashHex),
    judger2.judge(gagHashHex),
    judger3.judge(gagHashHex),
  ]);
  if (judgeResult.filter(b=>b).length >= 2) {
    result.setAttribute("class", "pass");
    result.textContent = "合格"
  }else {
    result.setAttribute("class", "failure");
    result.textContent = "不合格"
  }
}

const judge1 = document.querySelector("#judge1");
const judge2 = document.querySelector("#judge2");
const judge3 = document.querySelector("#judge3");
const judger1 = new Judger("01234567", 0.5, judge1);
const judger2 = new Judger("456789ab", 0.5, judge2);
const judger3 = new Judger("89abcdef", 0.5, judge3);

gagButton = document.getElementsByName("gagButton")[0];
gagText = document.querySelector("#gagText");

gagText.onchange = (e) => {
  if (e.target.value === "") {
    gagButton.disabled = true;
  } else {
    gagButton.disabled = false;
  };
};

gagButton.onclick = showGag;
