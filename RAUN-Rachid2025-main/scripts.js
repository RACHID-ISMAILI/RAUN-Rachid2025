import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let upVotes = 0;
let downVotes = 0;

export function vote(type) {
  if (type === 'up') upVotes++;
  else if (type === 'down') downVotes++;

  document.getElementById("voteCount").innerText = `Votes : ${upVotes} 👍 / ${downVotes} 👎`;
}

export function sendComment() {
  const comment = document.getElementById("commentInput").value;
  const section = document.getElementById("commentsSection");
  const p = document.createElement("p");
  p.textContent = comment;
  section.appendChild(p);
}
