import ScanButton from "../components/ScanButton";

type Props = {};

const XScan = (props: Props) => {
  const getTweets = () => {
    // Sử dụng Partial<Element> để tránh lỗi liên quan đến innerText
    let tweetElements = document.querySelectorAll<HTMLElement>(
      '[data-testid="tweetText"]',
    );
    let tweets: string[] = []; // Khai báo rõ ràng kiểu của tweets là mảng string

    tweetElements.forEach((tweet) => {
      if (tweet.innerText) {
        tweets.push(tweet.innerText);
      }
    });

    console.log(tweets);
    return tweets;
  };

  const scanPage = async () => {
    try {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        console.error("No active tab found or tab ID is missing.");
        return;
      }

      console.log("Active tab ID:", tab.id);

      // Execute script in the current tab
      const getCommentScriptResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getTweets,
      });

      console.log("Script result:", getCommentScriptResult);
    } catch (error) {
      console.error("Error in scanPage:", error);
    }
  };

  return (
    <div>
      <ScanButton onClick={() => scanPage()} />
    </div>
  );
};

export default XScan;
