// @ts-nocheck
import { useEffect, useState } from "react";
import "./App.css";
import { TinyColor } from "@ctrl/tinycolor";
import axios from "axios";
import { getChunks, newUUID } from "./utils/common";
import {
  NEGATIVE_MODERATION_ARRAY,
  POSITIVE_MODERATION_ARRAY,
} from "./constants/moderate";
import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import ScanButton from "../components/ScanButton";

const RedditScan = () => {
  const [loading, setLoading] = useState(false);
  const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  function getAllComment() {
    try {
      console.log("REACH FUNCTION SCRIPT");
      const commentElements = document.body.querySelectorAll(
        "shreddit-comment-tree#comment-tree shreddit-comment p"
      );
      console.log("🚀 ~ changeBackgroundColor ~ comment:", commentElements);
      const comments = Array.from(commentElements).map((commentElement) => {
        return commentElement.innerText;
      });

      return comments;
    } catch (error) {
      console.log("🚀 ~ changeBackgroundColor ~ error:", error);
    }
  }

  function updateDomCommentModeration(
    comments,
    positiveModerationArray,
    negativeModerationArray
  ) {
    console.log(
      "🚀 ~ updateDomCommentModeration ~ positiveModerationArray:",
      positiveModerationArray
    );
    try {
      console.log("🚀 ~ updateDomCommentModeration ~ comments:", comments);
      comments.map((comment) => {
        if (Object.values(comment.result).length > 0) {
          const text = comment.content;
          const moderateResults = comment.result;
          const domElements = document.body.querySelectorAll(
            `shreddit-comment-tree#comment-tree shreddit-comment p`
          );
          const domElement = Array.from(domElements).find((el) =>
            el.textContent.includes(text)
          );

          if (domElement) {
            console.log("🚀 ~ comments.map ~ domElement:", domElement);
            Object.keys(moderateResults).map((key) => {
              const moderateElement = document.createElement("p");
              moderateElement.textContent = `${
                key.charAt(0).toUpperCase() + key.slice(1)
              }: ${moderateResults[key].reasoning}`;

              if (positiveModerationArray.includes(key)) {
                moderateElement.style.backgroundColor = "#18a11b";
              } else if (negativeModerationArray.includes(key)) {
                domElement.style.opacity = 0.3;
                moderateElement.style.backgroundColor = "#d53232";
              } else {
                moderateElement.style.backgroundColor = "#95970a";
              }
              domElement.style.marginBottom = 0;
              moderateElement.style.borderRadius = "8px";
              moderateElement.style.padding = "4px";
              moderateElement.style.opacity = 1;
              moderateElement.style.marginTop = 0;

              domElement.insertAdjacentElement("afterend", moderateElement);
            });

            // Replace the original element with the new div
          }
        }
      });

      return comments;
    } catch (error) {
      console.log("🚀 ~ changeBackgroundColor ~ error:", error);
    }
  }

  async function scanPageContent() {
    chrome.runtime.sendMessage({ test: chrome });
    // return;
    try {
      setLoading(true);
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      // console.log("🚀 ~ onWindowLoad ~ tab:", chrome);

      // Execute script in the current tab
      const getCommentScriptResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getAllComment,
      });
      console.log("🚀 ~ onWindowLoad ~ scriptResult:", getCommentScriptResult);

      const commentChunks = getChunks(getCommentScriptResult[0].result, 5);

      for (let index = 0; index < commentChunks.length; index++) {
        const promises = [];
        const mappingRequest = {};
        const commentChunk = commentChunks[index];

        commentChunk.map((comment) => {
          console.log("🚀 ~ commentChunk.map ~ comment:", comment);
          const request_id = newUUID();
          mappingRequest[request_id] = comment;

          promises.push(
            (async () => {
              try {
                const headers = {
                  "Content-Type": "application/json",
                  "moev-api-key": "e9c3185e-d0d8-49ba-a3da-9d2b4947c15a",
                  accept: "application/json",
                };

                const bodyRequest = {
                  request_id,
                  content: comment,
                  metrics: {
                    unsafe:
                      "content indicates or promotes hate, toxicity, racism or bias towards individual or group",
                    joy: "Indicates happiness, pleasure, or satisfaction",
                    // Joy: "Indicates happiness, pleasure, or satisfaction.",
                    // Anger: " Indicates frustration, irritation, or rage.",
                    // Sadness: "Indicates sorrow, disappointment, or grief.",
                    // Surprise: "Indicates shock, amazement, or astonishment.",
                    fear: "Indicates anxiety, worry, or concern.",
                    // Disgust: "Indicates aversion, distaste, or repulsion.",
                  },
                  // {
                  //   Joy: "Indicates happiness, pleasure, or satisfaction.",
                  //   Anger: " Indicates frustration, irritation, or rage.",
                  //   Sadness: "Indicates sorrow, disappointment, or grief.",
                  //   Surprise: "Indicates shock, amazement, or astonishment.",
                  //   Fear: "Indicates anxiety, worry, or concern.",
                  //   Disgust: "Indicates aversion, distaste, or repulsion.",
                  // },
                };

                const response = await axios.post(
                  "https://api.modestus.ai/moderate",
                  bodyRequest,
                  {
                    headers: headers,
                  }
                );

                return response.data;
              } catch (error) {
                console.log("🚀 ~ comments.slice ~ error:", error);
              }
            })()
          );
        });

        const results = await Promise.all(promises);
        const mappedResults = results.map((result) => {
          const requestId = result.request_id;
          const result = result.result;

          return {
            requestId,
            content: mappingRequest[requestId],
            result,
          };
        });
        console.log("🚀 ~ scanPageContent ~ result:", mappedResults);

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: updateDomCommentModeration,
          args: [
            mappedResults,
            POSITIVE_MODERATION_ARRAY,
            NEGATIVE_MODERATION_ARRAY,
          ],
        });
      }
    } catch (error) {
      console.log("🚀 ~ onWindowLoad ~ error:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="w-[300px] h-[400px] flex items-center justify-center border border-[#34DFE8]">
    <ScanButton onClick={scanPageContent} isLoading={loading} />
    </div>
  );
}

export default RedditScan;
