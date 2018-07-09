const tweetField = document.getElementById('tweet-textarea');
const tweetCount = document.getElementById('tweet-char');
const tweetForm = document.querySelector('footer form');
let HOST = location.origin.replace(/^http/, 'ws');
console.log(HOST);

const ws = new WebSocket(HOST);

/* Change the number of characters left count on right side of text area */
tweetField.addEventListener('keyup', e => {
  tweetCount.textContent = 140 - e.target.value.length;
})

tweetField.addEventListener('paste', e => {
  tweetCount.textContent = 140 - e.target.value.length;
})

tweetForm.addEventListener('submit', e => {
  e.preventDefault();
  ws.send(tweetField.value);
})

ws.onerror = err => {
  console.log(err);
}