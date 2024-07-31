import { scanPage } from "./utils/contentScanner.js";

console.log("content script loaded!");
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "START_SCAN") {
    console.log("Received moderation data:", message.moderation);

    await scanPage(message.querySelector, message.moderation);
    chrome.runtime.sendMessage({
      type: "LOADING_STATUS",
      isLoading: false,
    });
    sendResponse({ status: "received" });
  }
});
