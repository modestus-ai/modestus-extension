import { SCAN_PAGE_STATUS } from "./constants/moderate";
import { ScanAction } from "./types/moderate.types";
import { scanPage } from "./utils/contentScanner";

console.log("content script loaded!");

const { START_SCAN, LOADING_STATUS } = SCAN_PAGE_STATUS;

chrome.runtime.onMessage.addListener(
  async (message: ScanAction, sender, sendResponse) => {
    if (message.action === START_SCAN) {
      console.log("Received moderation data:", message.moderation);

      await scanPage(message.querySelector, message.moderation);
      chrome.runtime.sendMessage({
        type: LOADING_STATUS,
        isLoading: false,
      });
      sendResponse({ status: "received" });
    }
  },
);
