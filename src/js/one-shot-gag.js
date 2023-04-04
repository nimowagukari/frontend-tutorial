import { Judger, showGag } from "./modules/judge";

const judge1 = document.querySelector("#judge1");
const judge2 = document.querySelector("#judge2");
const judge3 = document.querySelector("#judge3");
const judger1 = new Judger("01234567", 0.5, judge1);
const judger2 = new Judger("456789ab", 0.5, judge2);
const judger3 = new Judger("89abcdef", 0.5, judge3);

const gagButton = document.getElementsByName("gagButton")[0];
const gagText = document.querySelector("#gagText");

gagText.addEventListener("change", (e) => {
  if (e.target.value === "") {
    gagButton.disabled = true;
  } else {
    gagButton.disabled = false;
  }
});

gagButton.addEventListener("click", () => {
  showGag([judger1, judger2, judger3]);
});
