import { postModerate } from "../services/moderate.ts";

export const getContent = (querySelector) => {
  const elements = document.querySelectorAll(querySelector);
  return Array.from(elements).map((element, index) => ({
    text: element.innerText,
    index,
  }));
};

export const moderateContent = async (content, policies) => {
  try {
    const moderateData = { content, policies };
    return await postModerate(moderateData);
  } catch (e) {
    console.error("Something went wrong!");
  }
};

export const scanPage = async (querySelector, moderation) => {
  try {
    const getContentResult = getContent(querySelector);

    if (getContentResult.length > 0) {
      const moderationPromises = getContentResult.map((item) =>
        moderateContent(item.text, moderation.policies),
      );

      const moderationResults = await Promise.all(moderationPromises);

      moderationResults.forEach((result, index) => {
        if (result !== null) {
          const elements = document.querySelectorAll(querySelector);
          const element = elements[index];
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
              let resultElement = element.querySelector(`.${className}`);

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
        }
      });
    } else {
      console.log("No content found or content is empty.");
    }
  } catch (error) {
    console.error("Error in scanPage:", error);
  }
};
