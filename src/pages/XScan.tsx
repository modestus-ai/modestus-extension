import { useState } from "react";
import ScanButton from "../components/ScanButton";
import { v4 as uuidv4 } from "uuid";

const XScan = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTweets = () => {
    const tweetElements = document.querySelectorAll<HTMLElement>(
      '[data-testid="tweetText"]',
    );
    const tweets = Array.from(tweetElements).map((tweet, index) => ({
      text: tweet.innerText,
      index,
    }));

    return tweets;
  };

  const moderateTweet = async (content: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.modestus.ai/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "moev-api-key": "b2d2483d-06f7-4d51-8d2f-3d7655d5e52b",
        },
        body: JSON.stringify({
          request_id: uuidv4(),
          content,
          metrics: {
            unsafe:
              "content indicates or promotes hate, toxicity, racism or bias towards individual or group",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.result;
      } else {
        console.error("Error submitting moderation:", response.status);
        return null;
      }
    } catch (e) {
      console.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
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
      const tabId = tab.id;

      const getTweetsResult = await chrome.scripting.executeScript({
        target: { tabId },
        func: getTweets,
      });

      const tweets = getTweetsResult[0].result || [];
      if (tweets && tweets.length > 0) {
        const moderationPromises = tweets.map((tweet: any) =>
          moderateTweet(tweet.text),
        );

        const moderationResults = await Promise.all(moderationPromises);

        moderationResults.forEach((result, index) => {
          if (result !== null) {
            chrome.scripting.executeScript({
              target: { tabId },
              func: (result, index) => {
                const tweetElements = document.querySelectorAll<HTMLElement>(
                  '[data-testid="tweetText"]',
                );
                const tweetElement = tweetElements[index];
                if (tweetElement) {
                  tweetElement.childNodes.forEach((child) => {
                    if (
                      child instanceof HTMLElement &&
                      !child.classList.contains("moderation-result") &&
                      result.unsafe.reasoning
                    ) {
                      child.style.opacity = "0.3";
                    }
                  });

                  let resultElement: HTMLElement | null =
                    tweetElement.querySelector(".moderation-result");

                  if (resultElement) {
                    resultElement.innerText = result.unsafe.reasoning;
                  } else {
                    resultElement = document.createElement("p");
                    resultElement.className = "moderation-result";
                    resultElement.innerText = result.unsafe.reasoning;
                    resultElement.style.backgroundColor = "#d53232";
                    resultElement.style.borderRadius = "8px";
                    resultElement.style.padding = "4px";
                    resultElement.style.opacity = "1";
                    resultElement.style.marginTop = "4px";
                    tweetElement.appendChild(resultElement);
                  }
                }
              },
              args: [result, index],
            });
          }
        });
      } else {
        console.log("No tweets found or tweets are empty.");
      }
    } catch (error) {
      console.error("Error in scanPage:", error);
    }
  };

  return (
    <div>
      <ScanButton onClick={scanPage} isLoading={isLoading} />
    </div>
  );
};

export default XScan;
