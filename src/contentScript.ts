import {
  SAMPLE_POLICIES,
  SCAN_PAGE_STATUS,
  URLS_SCAN,
} from "./constants/moderate";
import { ScanAction } from "./types/moderate.types";
import { scanPage } from "./utils/contentScanner";

console.log("content script loaded!");

const { START_SCAN, LOADING_STATUS } = SCAN_PAGE_STATUS;
const scannedContentHashes = new Set<string>();

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

let isScanning = false;
let debounceTimeout: number | null = null;

const handleScroll = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = window.setTimeout(async () => {
    if (!isScanning) {
      isScanning = true;
      chrome.storage.local.get("moderation", async (res) => {
        const moderation = res["moderation"] || {
          policies: SAMPLE_POLICIES,
        };
        if (moderation) {
          const querySelector = getQuerySelectorForCurrentSite();
          if (querySelector) {
            await scanPage(querySelector, moderation, scannedContentHashes);
          }
        }
      });
      isScanning = false;
    }
  }, 300);
};

const getQuerySelectorForCurrentSite = () => {
  const url = window.location.href;
  const urlKey =
    Object.keys(URLS_SCAN).find((key) => url.includes(key)) ||
    URLS_SCAN["x.com"];
  return URLS_SCAN[urlKey];
};

window.addEventListener("scroll", handleScroll);
