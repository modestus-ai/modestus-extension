chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scanTweets") {
    getTweets();
  }
});

function getTweets() {
  let tweetElements = document.querySelectorAll('[data-testid="tweetText"]');
  let tweets = [];
  tweetElements.forEach((tweet) => tweets.push(tweet.innerText));
  console.log(tweets);
  chrome.runtime.sendMessage({ action: "tweetsScanned", tweets });
}
