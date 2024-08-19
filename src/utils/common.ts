import { v4 as uuidv4 } from "uuid";
import { CheckAndAppendReasoning } from "../types/moderate.types";
import { eyeNoneIcon, eyeOpenIcon } from "../assets/icons";

export const getChunks = (arr: Array<any>, chunkSize: number) => {
  if (chunkSize <= 0) throw "Invalid chunk size";
  const R = [];
  const len = arr.length;
  for (let i = 0; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
  return R;
};

export const sleep = (ms: number) => {
  return new Promise<void>((res, rej) => setTimeout(() => res(), ms));
};

export const currentTimestamp = () => {
  return Math.round(new Date().getTime() / 1000);
};

export const isNumberInRange = (n: number, nStart: number, nEnd: number) => {
  return n >= nStart && n < nEnd ? true : false;
};

export const newUUID = () => {
  return uuidv4();
};

export const hashContent = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
};

export const checkAndAppendReasoning = ({
  CONTENT_LOADED,
  item,
  elementsMap,
  appendReasoning,
}: CheckAndAppendReasoning) => {
  const contentHash = hashContent(item.text);
  if (CONTENT_LOADED[contentHash]) {
    const scanResults = CONTENT_LOADED[contentHash];
    if (scanResults) {
      appendReasoning(contentHash, scanResults, elementsMap);
    }
    return true;
  }
  return false;
};

export const contentScanElement = (className: string, reasoning: string) => {
  const p = document.createElement("p");
  p.className = className;
  p.innerText = reasoning;
  p.style.backgroundColor = "#AFEBF2";
  p.style.borderRadius = "6px";
  p.style.border = "1px solid #1F4A5A14";
  p.style.padding = "4px";
  p.style.fontSize = "12px";
  p.style.color = "#0F303D";
  p.style.opacity = "1";
  p.style.fontFamily = "sans-serif";
  return p;
};

export const toggleButtonElement = (showContent: string) => {
  const button = document.createElement("button");
  button.className = `toggle-button`;
  button.innerHTML = showContent;
  button.style.width = "fit-content";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.gap = "1px";
  button.style.padding = "4px 8px";
  button.style.fontSize = "12px";
  button.style.backgroundColor = "#F9FAFB";
  button.style.color = "#4B5563";
  button.style.border = "1px solid #D1D5DB";
  button.style.borderRadius = "1000px";
  button.style.cursor = "pointer";
  button.style.marginBottom = "4px";
  button.style.position = "relative";
  button.style.zIndex = "50";
  button.style.fontFamily = "revert";

  return button;
};

export const showHideElement = () => {
  const showElement = `<img src=${eyeOpenIcon} style="margin: 0px"/> Show Content`;
  const hideElement = `<img src=${eyeNoneIcon} style="margin: 0px"/> Hide Content`;
  return { showElement, hideElement };
};

export const removeContentElements = (element: HTMLElement) => {
  element
    .querySelectorAll('[class^="moderation-result-"]')
    .forEach((resultElement) => resultElement.remove());

  element.querySelector<HTMLElement>(".toggle-button")?.remove();
};

export const checkUrlSupport = (url: string): boolean => {
  if (url) {
    return (
      url.includes("x.com") ||
      url.includes("twitter.com") ||
      url.includes("reddit.com")
    );
  }
  return false;
};
