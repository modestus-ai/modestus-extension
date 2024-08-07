import { eyeNoneIcon, eyeOpenIcon } from "../assets/icons";
import { postModerate } from "../services/moderate";
import { ModerationState, PolicyItem } from "../types/moderate.types";

export const getContent = () => {
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

export const moderateContent = async (
  apiKey: string,
  content: string,
  policies: PolicyItem[],
) => {
  try {
    const moderateData = { apiKey, content, policies };
    return await postModerate(moderateData);
  } catch (e) {
    console.error("Something went wrong!", e);
    return null;
  }
};

const hashContent = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
};

const contentLoaded: {
  [hash: string]: {
    [key: string]: {
      reasoning: string;
    };
  };
} = {};

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

  const tweetPhotoElement = element.querySelector<HTMLElement>(
    ".css-175oi2r.r-9aw3ui.r-1s2bzr4",
  );

  const tweetTextElement = element.querySelector<HTMLElement>(
    '[data-testid="tweetText"]',
  );

  if (tweetTextElement) {
    if (!tweetTextElement.hasAttribute("data-visibility")) {
      tweetTextElement.setAttribute("data-visibility", "hidden");
    }

    const isHidden =
      tweetTextElement.getAttribute("data-visibility") === "hidden";

    tweetTextElement.childNodes.forEach((child) => {
      if (
        child instanceof HTMLElement &&
        !child.className.includes("moderation-result") &&
        Object.keys(scanResults).length
      ) {
        child.style.display = isHidden ? "none" : "";
      }
    });

    if (tweetPhotoElement) {
      tweetPhotoElement.style.display = isHidden ? "none" : "";
    }

    const resultKeys = Object.keys(scanResults);
    if (resultKeys.length) {
      tweetTextElement
        .querySelectorAll('[class^="moderation-result-"]')
        .forEach((resultElement) => resultElement.remove());

      resultKeys.forEach((resultKey, idx) => {
        const className = `moderation-result-${idx}`;
        let resultElement = tweetTextElement.querySelector<HTMLElement>(
          `.${className}`,
        );

        const reasoning = scanResults[resultKey]?.reasoning;
        if (resultElement) {
          resultElement.innerText = reasoning;
        } else {
          resultElement = document.createElement("p");
          resultElement.className = className;
          resultElement.innerText = reasoning;
          resultElement.style.backgroundColor = "#AFEBF2";
          resultElement.style.borderRadius = "6px";
          resultElement.style.border = "1px solid #1F4A5A14";
          resultElement.style.padding = "4px";
          resultElement.style.fontSize = "12px";
          resultElement.style.color = "#0F303D";
          resultElement.style.opacity = "1";
          resultElement.style.marginTop = "4px";
          resultElement.style.fontFamily = "sans-serif";

          if (tweetTextElement.firstChild) {
            tweetTextElement.insertBefore(
              resultElement,
              tweetTextElement.firstChild,
            );
          } else {
            tweetTextElement.appendChild(resultElement);
          }
        }
      });

      let toggleButton = tweetTextElement.nextElementSibling as HTMLElement;
      const showContent = `<img src=${eyeOpenIcon} /> Show Content`;
      const hideContent = `<img src=${eyeNoneIcon} /> Hide Content`;
      if (!toggleButton || !toggleButton.classList.contains("toggle-button")) {
        toggleButton = document.createElement("button");
        toggleButton.className = `toggle-button`;
        toggleButton.innerHTML = showContent;
        toggleButton.style.width = "fit-content";
        toggleButton.style.display = "flex";
        toggleButton.style.alignItems = "center";
        toggleButton.style.gap = "1px";
        toggleButton.style.padding = "4px 8px";
        toggleButton.style.fontSize = "12px";
        toggleButton.style.backgroundColor = "#F9FAFB";
        toggleButton.style.color = "#4B5563";
        toggleButton.style.border = "1px solid #D1D5DB";
        toggleButton.style.borderRadius = "1000px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.fontFamily = "sans-serif";

        toggleButton.addEventListener("click", () => {
          const currentVisibility =
            tweetTextElement.getAttribute("data-visibility");
          const newVisibility =
            currentVisibility === "hidden" ? "visible" : "hidden";
          tweetTextElement.setAttribute("data-visibility", newVisibility);
          toggleButton.innerHTML =
            currentVisibility === "hidden" ? hideContent : showContent;

          tweetTextElement.childNodes.forEach((child) => {
            if (
              child instanceof HTMLElement &&
              !child.className.includes("moderation-result") &&
              resultKeys.length
            ) {
              child.style.display = newVisibility === "hidden" ? "none" : "";
            }
          });

          if (tweetPhotoElement) {
            tweetPhotoElement.style.display =
              newVisibility === "hidden" ? "none" : "";
          }
        });

        tweetTextElement.insertAdjacentElement("afterend", toggleButton);
      }
    } else {
      tweetTextElement
        .querySelectorAll('[class^="moderation-result-"]')
        .forEach((resultElement) => resultElement.remove());
      tweetTextElement.removeAttribute("data-visibility");
      tweetTextElement.childNodes.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.display = "";
        }
      });
      if (tweetPhotoElement) {
        tweetPhotoElement.style.display = "";
      }
      const toggleBtn = tweetTextElement.nextElementSibling as HTMLElement;
      if (toggleBtn && toggleBtn.classList.contains("toggle-button")) {
        toggleBtn.remove();
      }
    }
  }
};

const checkAndAppendReasoning = (
  item: { text: string; element: HTMLElement },
  elementsMap: Map<string, HTMLElement>,
) => {
  const contentHash = hashContent(item.text);
  if (contentLoaded[contentHash]) {
    const scanResults = contentLoaded[contentHash];
    if (scanResults) {
      appendReasoning(contentHash, scanResults, elementsMap);
    }
    return true;
  }
  return false;
};

export const scanXPage = async (
  apiKey: string,
  moderation: ModerationState,
  scannedContentHashes?: Set<string>,
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
            checkAndAppendReasoning(item, elementsMap),
          );
        } else {
          let moderationPromises = moderationScanned.map((item) => {
            if (checkAndAppendReasoning(item, elementsMap)) {
              return Promise.resolve(null);
            }

            return moderateContent(apiKey, item.text, moderation.policies).then(
              (result) => {
                if (result) {
                  const contentHash = hashContent(item.text);
                  contentLoaded[contentHash] = result;
                  return result;
                }
                return null;
              },
            );
          });

          const moderationResults = await Promise.all(moderationPromises);

          moderationResults.forEach((result, index) => {
            if (result !== null) {
              const contentHash = hashContent(moderationScanned[index].text);
              appendReasoning(contentHash, result, elementsMap);
            }
          });
        }
      } else {
        const moderationPromises = getContentResult.map((item) => {
          return moderateContent(apiKey, item.text, moderation.policies).then(
            (result) => {
              if (result) {
                const contentHash = hashContent(item.text);
                contentLoaded[contentHash] = result;
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
    } else {
      console.log("No content found or content is empty.");
    }
  } catch (error) {
    console.error("Error in scanPage:", error);
  }
};
