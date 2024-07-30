const getTweets = () => {
  const tweetElements = document.querySelectorAll('[data-testid="tweetText"]');
  return Array.from(tweetElements).map((tweet, index) => ({
    text: tweet.innerText,
    index,
  }));
};

const updateTweetResults = (results) => {
  const tweetElements = document.querySelectorAll('[data-testid="tweetText"]');
  console.log("123", results, tweetElements);

  results.forEach((result, index) => {
    const tweetElement = tweetElements[index];
    if (tweetElement) {
      // // Remove old result if exists
      // const oldResultElement = tweetElement.querySelector(".moderation-result");
      // if (oldResultElement) {
      //   oldResultElement.remove();
      // }

      // Apply opacity to tweet text
      tweetElement.childNodes.forEach((child) => {
        if (
          child instanceof HTMLElement &&
          !child.classList.contains("moderation-result") &&
          result.unsafe.reasoning
        ) {
          child.style.opacity = "0.3";
        }
      });

      // Create new result element
      const resultElement = document.createElement("p");
      resultElement.className = "moderation-result";
      resultElement.innerText = result.unsafe.reasoning;
      resultElement.style.backgroundColor = "#d53232";
      resultElement.style.borderRadius = "8px";
      resultElement.style.padding = "4px";
      resultElement.style.opacity = "1";
      resultElement.style.marginTop = "4px";
      tweetElement.appendChild(resultElement);
    }
  });
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTweetResults") {
    updateTweetResults(message.results);
  }
});
