import {
  SAMPLE_POLICIES,
  SCAN_PAGE_STATUS,
  URLS_SCAN,
} from "./constants/moderate";
import { getApiKeyModerate } from "./services/moderate";
import { ScanAction } from "./types/moderate.types";
import { scanPage } from "./utils/contentScanner";

console.log("content script loaded!");

const { START_SCAN, LOADING_STATUS } = SCAN_PAGE_STATUS;
const scannedContentHashes = new Set<string>();

let moderateKey = "";
let isScanning = false;
let debounceTimeout: number | null = null;

const fetchApiKey = async () => {
  moderateKey = await getApiKeyModerate();
};

fetchApiKey();

const handleScroll = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = window.setTimeout(async () => {
    if (!isScanning && moderateKey) {
      isScanning = true;
      chrome.storage.local.get("moderation", async (res) => {
        const moderation = res["moderation"] || {
          policies: SAMPLE_POLICIES,
        };
        if (moderation) {
          const querySelector = getQuerySelectorForCurrentSite();
          if (querySelector) {
            await scanPage(
              moderateKey,
              querySelector,
              moderation,
              scannedContentHashes,
            );
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

chrome.runtime.onMessage.addListener(
  async (message: ScanAction, sender, sendResponse) => {
    if (message.action === START_SCAN && moderateKey) {
      await scanPage(moderateKey, message.querySelector, message.moderation);
      chrome.runtime.sendMessage({
        type: LOADING_STATUS,
        isLoading: false,
      });
      sendResponse({ status: "received" });
    }
  },
);
