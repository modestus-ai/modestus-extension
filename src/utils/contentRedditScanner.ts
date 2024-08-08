import { eyeNoneIcon, eyeOpenIcon } from "../assets/icons";
import { postModerate } from "../services/moderate";
import { ModerationState, PolicyItem } from "../types/moderate.types";

const getContent = () => {
  const elements = document.querySelectorAll<HTMLElement>("shreddit-post");
  return Array.from(elements).map((element) => {
    const clone = element.cloneNode(true) as HTMLElement;

    clone
      .querySelectorAll('[class^="moderation-result-"]')
      .forEach((resultElement) => resultElement.remove());

    const title =
      clone.querySelector<HTMLElement>('[slot="title"]')?.innerText || "";

    return {
      text: title,
      element,
    };
  });
};

const moderateContent = async (
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

  const titleElement = element.querySelector<HTMLElement>('[slot="title"]');
  const textBody = element.querySelector<HTMLElement>('[slot="text-body"]');
  const mediaElement = element.querySelector<HTMLElement>(
    '[slot="post-media-container"]',
  );

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
      titleElement
        .querySelectorAll('[class^="moderation-result-"]')
        .forEach((resultElement) => resultElement.remove());

      resultKeys.forEach((resultKey, idx) => {
        const className = `moderation-result-${idx}`;
        let resultElement = element.querySelector<HTMLElement>(`.${className}`);

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
          resultElement.style.fontFamily = "sans-serif";
          titleElement.insertAdjacentElement("beforebegin", resultElement);
        }
      });

      let toggleButton = titleElement.nextElementSibling as HTMLElement;
      const showContent = `<img src=${eyeOpenIcon} style="margin: 0px"/> Show Content`;
      const hideContent = `<img src=${eyeNoneIcon} style="margin: 0px"/> Hide Content`;
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
        toggleButton.style.marginBottom = "4px";
        toggleButton.style.position = "relative";
        toggleButton.style.zIndex = "50";

        toggleButton.addEventListener("click", () => {
          const currentVisibility =
            titleElement.getAttribute("data-visibility");
          const newVisibility =
            currentVisibility === "hidden" ? "visible" : "hidden";
          titleElement.setAttribute("data-visibility", newVisibility);
          toggleButton.innerHTML =
            currentVisibility === "hidden" ? hideContent : showContent;

          titleElement.style.display = newVisibility === "hidden" ? "none" : "";

          if (mediaElement) {
            mediaElement.style.display =
              newVisibility === "hidden" ? "none" : "";
          }

          if (textBody) {
            textBody.style.display = newVisibility === "hidden" ? "none" : "";
          }
        });

        titleElement.insertAdjacentElement("afterend", toggleButton);
      }
    } else {
      titleElement
        .querySelectorAll('[class^="moderation-result-"]')
        .forEach((resultElement) => resultElement.remove());
      // titleElement.removeAttribute("data-visibility");
      if (mediaElement) {
        mediaElement.style.display = "";
      }
      if (textBody) {
        textBody.style.display = "";
      }
      const toggleBtn = titleElement.nextElementSibling as HTMLElement;
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

export const scanRedditPage = async (
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
