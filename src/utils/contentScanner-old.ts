import { postModerate } from "../services/moderate";
import { ModerationState, PolicyItem } from "../types/moderate.types";

export const getContent = (querySelector: string) => {
  const elements = document.querySelectorAll<HTMLElement>(querySelector);
  return Array.from(elements).map((element, index) => {
    const clone = element.cloneNode(true) as HTMLElement;

    clone
      .querySelectorAll('[class^="moderation-result-"]')
      .forEach((resultElement) => resultElement.remove());

    return {
      text: clone.innerText,
      index,
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
  querySelector: string,
  scanResults: {
    [key: string]: {
      reasoning: string;
    };
  },
  elementIndex: number,
) => {
  const elements = document.querySelectorAll<HTMLElement>(querySelector);
  const element = elements[elementIndex];

  if (element) {
    element.childNodes.forEach((child) => {
      if (
        child instanceof HTMLElement &&
        !child.className.includes("moderation-result") &&
        Object.keys(scanResults).length
      ) {
        child.style.opacity = "0.3";
      }
    });

    const resultKeys = Object.keys(scanResults);
    if (resultKeys.length) {
      element
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
          resultElement.style.backgroundColor = "#FD4040";
          resultElement.style.borderRadius = "12px";
          resultElement.style.padding = "4px";
          resultElement.style.opacity = "1";
          resultElement.style.marginTop = "4px";
          resultElement.style.order = "0";

          if (element.firstChild) {
            element.insertBefore(resultElement, element.firstChild);
          } else {
            element.appendChild(resultElement);
          }
        }
      });
    } else {
      element
        .querySelectorAll('[class^="moderation-result-"]')
        .forEach((resultElement) => resultElement.remove());
      element.childNodes.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.opacity = "1";
        }
      });
    }
  }
};

const checkAndAppendReasoning = (
  querySelector: string,
  item: { text: string; index: number },
) => {
  const contentHash = hashContent(item.text);
  if (contentLoaded[contentHash]) {
    const scanResults = contentLoaded[contentHash];
    if (scanResults) {
      appendReasoning(querySelector, scanResults, item.index);
    }
    return true;
  }
  return false;
};

export const scanPage = async (
  apiKey: string,
  querySelector: string,
  moderation: ModerationState,
  scannedContentHashes?: Set<string>,
) => {
  try {
    const getContentResult = getContent(querySelector);

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
            checkAndAppendReasoning(querySelector, item),
          );
        } else {
          let moderationPromises = moderationScanned.map((item) => {
            if (checkAndAppendReasoning(querySelector, item)) {
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
              appendReasoning(querySelector, result, index);
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
            appendReasoning(querySelector, result, index);
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
