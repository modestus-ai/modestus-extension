import { useState } from "react";
import { postModerate } from "../services/moderate";
import { ModerationState } from "../types/moderate.types";

type ContentModerationResult = {
  [key: string]: {
    reasoning: string;
  };
};

const useContentScanner = (querySelector: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const getContent = (querySelector: string) => {
    const elements = document.querySelectorAll<HTMLElement>(querySelector);
    const contentItems = Array.from(elements).map((element, index) => ({
      text: element.innerText,
      index,
    }));
    return contentItems;
  };

  const moderateContent = async (
    apiKey: string,
    content: string,
    policies: ModerationState["policies"],
  ) => {
    try {
      setIsLoading(true);
      const moderateData = {
        apiKey,
        content,
        policies,
      };
      return await postModerate(moderateData);
    } catch (e) {
      console.error("Something went wrong!");
    }
  };

  const scanPage = async (apiKey: string, moderation: ModerationState) => {
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

      const getContentResult = await chrome.scripting.executeScript({
        target: { tabId },
        func: getContent,
        args: [querySelector],
      });

      const contentItems = getContentResult[0].result || [];
      if (contentItems && contentItems.length > 0) {
        const moderationPromises = contentItems.map((item: any) =>
          moderateContent(apiKey, item.text, moderation.policies),
        );

        const moderationResults = await Promise.all(moderationPromises);

        moderationResults.forEach(
          (result: ContentModerationResult, index: number) => {
            if (result !== null) {
              chrome.scripting.executeScript({
                target: { tabId },
                func: (querySelector: string, result: any, index: number) => {
                  const elements =
                    document.querySelectorAll<HTMLElement>(querySelector);
                  const element = elements[index as number];
                  if (element) {
                    element.childNodes.forEach((child) => {
                      if (
                        child instanceof HTMLElement &&
                        !child.className.includes("moderation-result") &&
                        Object.keys(result).length
                      ) {
                        child.style.opacity = "0.3";
                      }
                    });

                    const resultKeys = Object.keys(result);
                    resultKeys.forEach((resultKey, idx) => {
                      const className = `moderation-result-${idx}`;
                      let resultElement: HTMLElement | null =
                        element.querySelector(`.${className}`);

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
                        element.appendChild(resultElement);
                      }
                    });
                  }
                },
                args: [querySelector, result, index],
              });
            }
          },
        );
      } else {
        console.log("No content found or content is empty.");
      }
    } catch (error) {
      console.error("Error in scanPage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { scanPage, isLoading };
};

export default useContentScanner;
