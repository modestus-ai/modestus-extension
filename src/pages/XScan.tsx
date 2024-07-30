import { useState } from "react";
import ScanButton from "../components/ScanButton";
import { PolicyItem } from "../types/moderate.types";
import { postModerate } from "../services/moderate";

type Props = {
  policies: PolicyItem[];
};

const XScan = ({ policies }: Props) => {
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
      const moderateData = {
        content,
        policies,
      };
      return await postModerate(moderateData);
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
              func: (result: any, index) => {
                const tweetElements = document.querySelectorAll<HTMLElement>(
                  '[data-testid="tweetText"]',
                );
                const tweetElement = tweetElements[index as number];
                if (tweetElement) {
                  tweetElement.childNodes.forEach((child) => {
                    if (
                      child instanceof HTMLElement &&
                      !child.className.includes("moderation-result") &&
                      Object.keys(result).length
                    ) {
                      child.style.opacity = "0.3";
                    }
                  });

                  const resultKeys = Object.keys(result);
                  resultKeys.forEach((resultKey, index) => {
                    const className = `moderation-result-${index}`;
                    let resultElement: HTMLElement | null =
                      tweetElement.querySelector(`.${className}`);

                    const reasoning = result[resultKey]?.reasoning;
                    if (resultElement) {
                      resultElement.innerText = reasoning;
                    } else {
                      resultElement = document.createElement("p");
                      resultElement.className = className;
                      resultElement.innerText = reasoning;
                      resultElement.style.backgroundColor = "#d53232";
                      resultElement.style.borderRadius = "8px";
                      resultElement.style.padding = "4px";
                      resultElement.style.opacity = "1";
                      resultElement.style.marginTop = "4px";
                      tweetElement.appendChild(resultElement);
                    }
                  });
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

  return <ScanButton onClick={scanPage} isLoading={isLoading} />;
};

export default XScan;
