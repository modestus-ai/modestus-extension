import {
  SAMPLE_POLICIES,
  SCAN_PAGE_STATUS,
  // URLS_SCAN,
} from "./constants/moderate";
import { getApiKeyModerate } from "./services/moderate";
import { ScanAction } from "./types/moderate.types";
// import { scanPage } from "./utils/contentScanner";
import { scanXPage } from "./utils/contentTweetScanner";

console.log("content script loaded!");

const { START_SCAN, LOADING_STATUS, AUTO_SCAN_STATUS } = SCAN_PAGE_STATUS;
const scannedContentHashes = new Set<string>();

let moderateKey = "";
let debounceTimeout: number | null = null;
let isScanning: boolean = false;
let autoScan: boolean = true;

chrome.storage.local.get("autoScan", (res) => {
  if (typeof res["autoScan"] === "boolean") {
    autoScan = res["autoScan"] ? true : false;
  }
});
const urlX = window.location.href.includes("x.com");

const fetchApiKey = async () => {
  moderateKey = await getApiKeyModerate();
};

if (urlX) {
  fetchApiKey();
}

// const getQuerySelectorForCurrentSite = () => {
//   const url = window.location.href;
//   const urlKey =
//     Object.keys(URLS_SCAN).find((key) => url.includes(key)) ||
//     URLS_SCAN["x.com"];
//   return URLS_SCAN[urlKey];
// };

const handleScroll = () => {
  if (autoScan) {
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
            // const querySelector = getQuerySelectorForCurrentSite();
            if (urlX) {
              await scanXPage(moderateKey, moderation, scannedContentHashes);
            }
            // await scanPage(
            //   moderateKey,
            //   querySelector,
            //   moderation,
            //   scannedContentHashes,
            // );
          }
        });
        isScanning = false;
      }
    }, 10);
  }
};

chrome.runtime.onMessage.addListener(
  async (message: ScanAction, sender, sendResponse) => {
    if (message.action === START_SCAN && moderateKey) {
      await scanXPage(moderateKey, message.moderation, undefined);
      chrome.runtime.sendMessage({
        type: LOADING_STATUS,
        isLoading: false,
      });
      sendResponse({ status: "received" });
    }
  },
);

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === AUTO_SCAN_STATUS) {
    autoScan = message.autoScan;
  }
});

window.addEventListener("scroll", handleScroll);
