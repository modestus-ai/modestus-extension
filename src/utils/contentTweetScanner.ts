import { CONTENT_LOADED } from "../constants/moderate";
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

const getContent = () => {
  const elements = document.querySelectorAll<HTMLElement>(
    '[data-testid="tweet"]',
  );
  return Array.from(elements).map((element) => {
    const clone = element.cloneNode(true) as HTMLElement;

    clone
      .querySelectorAll('[class^="moderation-result-"]')
      .forEach((resultElement) => resultElement.remove());

    const tweetText =
      clone.querySelector<HTMLElement>('[data-testid="tweetText"]')
        ?.innerText || "";

    return {
      text: tweetText,
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
  const element = elementsMap.get(hash);
  if (!element) return;

  const mediaElement = element.querySelector<HTMLElement>(
    ".css-175oi2r.r-9aw3ui.r-1s2bzr4",
  );

  const tweetTextElement = element.querySelector<HTMLElement>(
    '[data-testid="tweetText"]',
  );

  const toggleBtnElement = element.querySelector<HTMLElement>(".toggle-button");

  if (tweetTextElement) {
    if (!tweetTextElement.hasAttribute("data-visibility")) {
      tweetTextElement.setAttribute("data-visibility", "hidden");
    }

    const isHidden =
      tweetTextElement.getAttribute("data-visibility") === "hidden";
    const resultKeys = Object.keys(scanResults);

    if (tweetTextElement && resultKeys.length) {
      tweetTextElement.style.display = isHidden ? "none" : "";
    }

    if (mediaElement) {
      mediaElement.style.display = isHidden ? "none" : "";
    }

    if (resultKeys.length) {
      // resultKeys.forEach((resultKey, idx) => {
      //   const className = `moderation-result-${idx}`;
      //   let resultElement = element.querySelector<HTMLElement>(`.${className}`);

      //   const reasoning = scanResults[resultKey]?.reasoning;
      //   if (resultElement) {
      //     resultElement.innerText = reasoning;
      //   } else {
      //     const resultElement = contentScanElement(className, reasoning);
      //     tweetTextElement.insertAdjacentElement("beforebegin", resultElement);
      //   }
      // });

      let resultElement =
        element.querySelector<HTMLElement>(".moderation-result");
      if (!resultElement) {
        resultElement = scanWrapperElement(scanResults);
        tweetTextElement.insertAdjacentElement("beforebegin", resultElement);
      }

      if (!toggleBtnElement) {
        const { showElement, hideElement } = showHideElement();

        const button = toggleButtonElement(showElement);

        button.addEventListener("click", () => {
          const currentVisibility =
            tweetTextElement.getAttribute("data-visibility");
          const newVisibility =
            currentVisibility === "hidden" ? "visible" : "hidden";
          tweetTextElement.setAttribute("data-visibility", newVisibility);
          button.innerHTML =
            currentVisibility === "hidden" ? hideElement : showElement;

          tweetTextElement.style.display =
            newVisibility === "hidden" ? "none" : "";
          if (mediaElement) {
            mediaElement.style.display =
              newVisibility === "hidden" ? "none" : "";
          }
        });
        resultElement.appendChild(button);
        // tweetTextElement.appendChild("beforebegin", button);
      }
    } else {
      removeContentElements(element);
      // tweetTextElement.removeAttribute("data-visibility");
      tweetTextElement.style.display = "";
      if (mediaElement) {
        mediaElement.style.display = "";
      }
    }
  }
};

export const scanXPage = async (
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
      if (scannedContentHashes) {
        const moderationScanned = getContentResult.filter((item) => {
          const contentHash = hashContent(item.text);
          if (scannedContentHashes.has(contentHash)) {
            return false;
          } else {
            scannedContentHashes.add(contentHash);
            return true;
          }
        });

        if (moderationScanned.length === 0) {
          getContentResult.forEach((item) =>
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
                const contentHash = hashContent(moderationScanned[index].text);
                appendReasoning(contentHash, result, elementsMap);
              }
            });
          }
        }
      } else {
        if (autoScan) {
          const moderationPromises = getContentResult.map((item) => {
            return moderateContent(apiKey, item.text, moderation.policies).then(
              (result) => {
                if (result) {
                  const contentHash = hashContent(item.text);
                  CONTENT_LOADED[contentHash] = result;
                  return result;
                }
                return null;
              },
            );
          });
          const moderationResults = await Promise.all(moderationPromises);

          moderationResults.forEach((result, index) => {
            if (result !== null) {
              const contentHash = hashContent(getContentResult[index].text);
              appendReasoning(contentHash, result, elementsMap);
            }
          });
        }
      }
    } else {
      console.log("No content found or content is empty.");
    }
  } catch (error) {
    console.error("Error in scanPage:", error);
  }
};
