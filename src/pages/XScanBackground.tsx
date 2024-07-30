import React from "react";
import ScanButton from "../components/ScanButton";
import { v4 as uuidv4 } from "uuid";

type Props = {};

const XScan: React.FC<Props> = () => {
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

        // Send results to background script to update content script
        chrome.runtime.sendMessage({
          action: "updateTweetResults",
          results: moderationResults.map((result, index) => ({
            unsafe: result,
            index,
          })),
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
      <ScanButton onClick={scanPage} />
    </div>
  );
};

export default XScan;
