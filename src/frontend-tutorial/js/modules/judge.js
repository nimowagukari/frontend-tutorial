async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // (utf-8 の) Uint8Array にエンコードする
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // メッセージをハッシュする
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファーをバイト列に変換する
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // バイト列を16進文字列に変換する
  return hashHex;
}

export function Judger(laughtCharacters, passThreshold, node) {
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

export async function showGag(judgers) {
  const gagText = document.querySelector("#gagText").value;
  const resultText = document.querySelector("#result");
  const gagHashHex = await digestMessage(gagText);
  const judgeResultsPromise = judgers.map((j) => j.judge(gagHashHex));

  resultText.removeAttribute("class");
  resultText.textContent = "";

  const judgeResults = await Promise.all(judgeResultsPromise);
  if (judgeResults.filter((b) => b).length >= 2) {
    resultText.setAttribute("class", "pass");
    resultText.textContent = "合格";
  } else {
    resultText.setAttribute("class", "failure");
    resultText.textContent = "不合格";
  }
}
