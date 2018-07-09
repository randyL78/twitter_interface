const tweetField = document.getElementById('tweet-textarea');
const tweetCount = document.getElementById('tweet-char');
const tweetForm = document.querySelector('footer form');
const homeButton = document.getElementById('home-btn');

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

/* listen for 'tweet' button to be pressed */
tweetForm.addEventListener('submit', e => {
  /* keep page from refreshing */
  e.preventDefault();
  /* send the tweet from client to server */
  ws.send(tweetField.value);
})

/* Log out any Websocket errors */
ws.onerror = err => {
  console.log(err);
}