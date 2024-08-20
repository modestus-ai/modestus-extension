import { CONTENT_LOADED } from "./../constants/moderate";
import { moderateContent } from "../services/moderate";
import { ModerationState } from "../types/moderate.types";
import {
  checkAndAppendReasoning,
  contentScanElement,
  hashContent,
  removeContentElements,
  scanWrapperElement,
  showHideElement,
  toggleButtonElement,
} from "./common";

const redditCommentsUrl = () => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  return url.includes("reddit.com") && url.includes("comments");
};

const getContent = () => {
  const isRedditComments = redditCommentsUrl();

  let elements = document.querySelectorAll<HTMLElement>(
    !isRedditComments ? "shreddit-post" : "shreddit-comment",
  );

  return Array.from(elements).map((element) => {
    const clone = element.cloneNode(true) as HTMLElement;

    clone
      .querySelectorAll('[class^="moderation-result-"]')
      .forEach((resultElement) => resultElement.remove());

    let title =
      clone.querySelector<HTMLElement>(
        !isRedditComments ? '[slot="title"]' : '[slot="comment"]',
      )?.innerText || "";

    return {
      text: title,
      element,
    };
  });
};

const appendReasoning = (
  hash: string,
  scanResults: {
    [key: string]: {
      reasoning: string;
    };
  },
  elementsMap: Map<string, HTMLElement>,
) => {
  const isRedditComments = redditCommentsUrl();

  const element = elementsMap.get(hash);
  if (!element) return;

  const titleElement = element.querySelector<HTMLElement>(
    !isRedditComments ? '[slot="title"]' : '[slot="comment"]',
  );
  const textBody = element.querySelector<HTMLElement>('[slot="text-body"]');
  const mediaElement = element.querySelector<HTMLElement>(
    '[slot="post-media-container"]',
  );
  const toggleBtnElement = element.querySelector<HTMLElement>(".toggle-button");

  if (titleElement) {
    if (!titleElement.hasAttribute("data-visibility")) {
      titleElement.setAttribute("data-visibility", "hidden");
    }

    const isHidden = titleElement.getAttribute("data-visibility") === "hidden";

    if (titleElement && Object.keys(scanResults).length) {
      titleElement.style.display = isHidden ? "none" : "";
    }

    if (mediaElement) {
      mediaElement.style.display = isHidden ? "none" : "";
    }

    if (textBody) {
      textBody.style.display = isHidden ? "none" : "";
    }

    const resultKeys = Object.keys(scanResults);

    if (resultKeys.length) {
      // resultKeys.forEach((resultKey, idx) => {
      //   const className = `moderation-result-${idx}`;
      //   let resultElement = element.querySelector<HTMLElement>(`.${className}`);

      //   const reasoning = scanResults[resultKey]?.reasoning;
      //   if (resultElement) {
      //     resultElement.innerText = reasoning;
      //   } else {
      //     const resultElement = contentScanElement(className, reasoning);
      //     titleElement.insertAdjacentElement("beforebegin", resultElement);
      //   }
      // });
      let resultElement =
        element.querySelector<HTMLElement>(".moderation-result");
      if (!resultElement) {
        resultElement = scanWrapperElement(scanResults);
        titleElement.insertAdjacentElement("beforebegin", resultElement);
      }

      if (!toggleBtnElement) {
        const { showElement, hideElement } = showHideElement();

        const button = toggleButtonElement(showElement);

        button.addEventListener("click", () => {
          const newVisibility =
            titleElement.getAttribute("data-visibility") === "hidden"
              ? "visible"
              : "hidden";

          titleElement.setAttribute("data-visibility", newVisibility);

          const display = newVisibility === "hidden" ? "none" : "";

          button.innerHTML =
            newVisibility === "hidden" ? hideElement : showElement;

          titleElement.style.display = display;

          if (mediaElement) {
            mediaElement.style.display = display;
          }

          if (textBody) {
            textBody.style.display = display;
          }
        });
        // titleElement.insertAdjacentElement("afterend", button);
        resultElement.appendChild(button);
      }
    } else {
      removeContentElements(element);
      // titleElement.removeAttribute("data-visibility");
      titleElement.style.display = "";
      if (mediaElement) {
        mediaElement.style.display = "";
      }
      if (textBody) {
        textBody.style.display = "";
      }
    }
  }
};

export const scanRedditPage = async (
  apiKey: string,
  moderation: ModerationState,
  scannedContentHashes?: Set<string>,
  autoScan?: boolean,
) => {
  try {
    const getContentResult = getContent();
    const elementsMap = new Map<string, HTMLElement>();

    getContentResult.forEach((item) => {
      const contentHash = hashContent(item.text);
      elementsMap.set(contentHash, item.element);
    });

    if (getContentResult.length > 0) {
      const chunks = [];
      for (let i = 0; i < getContentResult.length; i += 5) {
        chunks.push(getContentResult.slice(i, i + 5));
      }

      for (const chunk of chunks) {
        if (scannedContentHashes) {
          const moderationScanned = chunk.filter((item) => {
            const contentHash = hashContent(item.text);
            if (scannedContentHashes.has(contentHash)) {
              return false;
            } else {
              scannedContentHashes.add(contentHash);
              return true;
            }
          });

          if (moderationScanned.length === 0) {
            chunk.forEach((item) =>
              checkAndAppendReasoning({
                CONTENT_LOADED,
                item,
                elementsMap,
                appendReasoning,
              }),
            );
          } else {
            if (autoScan) {
              let moderationPromises = moderationScanned.map((item) => {
                if (
                  checkAndAppendReasoning({
                    CONTENT_LOADED,
                    item,
                    elementsMap,
                    appendReasoning,
                  })
                ) {
                  return Promise.resolve(null);
                }

                return moderateContent(
                  apiKey,
                  item.text,
                  moderation.policies,
                ).then((result) => {
                  if (result) {
                    const contentHash = hashContent(item.text);
                    CONTENT_LOADED[contentHash] = result;
                    return result;
                  }
                  return null;
                });
              });

              const moderationResults = await Promise.all(moderationPromises);

              moderationResults.forEach((result, index) => {
                if (result !== null) {
                  const contentHash = hashContent(
                    moderationScanned[index].text,
                  );
                  appendReasoning(contentHash, result, elementsMap);
                }
              });
            }
          }
        } else {
          if (autoScan) {
            const moderationPromises = chunk.map((item) => {
              return moderateContent(
                apiKey,
                item.text,
                moderation.policies,
              ).then((result) => {
                if (result) {
                  const contentHash = hashContent(item.text);
                  CONTENT_LOADED[contentHash] = result;
                  return result;
                }
                return null;
              });
            });
            const moderationResults = await Promise.all(moderationPromises);

            moderationResults.forEach((result, index) => {
              if (result !== null) {
                const contentHash = hashContent(chunk[index].text);
                appendReasoning(contentHash, result, elementsMap);
              }
            });
          }
        }
      }
    } else {
      console.log("No content found or content is empty.");
    }
  } catch (error) {
    console.error("Error in scanPage:", error);
  }
};
