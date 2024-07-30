chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchTweets") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        func: () => {
          const tweetElements = document.querySelectorAll(
            '[data-testid="tweetText"]',
          );
          return Array.from(tweetElements).map((tweet) => tweet.innerText);
        },
      },
      (results) => {
        sendResponse({ tweets: results[0].result });
      },
    );
    return true; // Indicate that we will respond asynchronously
  } else if (message.action === "updateTweetResults") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: (results) => {
        // Pass the results to content script to update DOM
        chrome.runtime.sendMessage({ action: "updateTweetResults", results });
      },
      args: [message.results],
    });
  }
});
