import {
  SAMPLE_POLICIES,
  SCAN_PAGE_STATUS,
  URLS_SCAN,
} from "./constants/moderate";
import { MessageTypes, ModerationState } from "./types/moderate.types";

const { START_SCAN, UPDATE_MODERATION, UPDATE_AUTO_SCAN, AUTO_SCAN_STATUS } =
  SCAN_PAGE_STATUS;

let moderation: ModerationState = {
  policies: SAMPLE_POLICIES,
};
let autoScan = true;

chrome.storage.local.get(["moderation", "autoScan"], (res) => {
  if (res["moderation"]) {
    moderation = res["moderation"];
  }
  if (typeof res["autoScan"] === "boolean") {
    autoScan = res["autoScan"] ? true : false;
  }
});

const sendModeration = () => {
  const message = { action: START_SCAN, moderation, autoScan };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        const urlItem = Object.keys(URLS_SCAN).find((url) =>
          tab.url?.includes(url),
        );
        const querySelector = urlItem ? URLS_SCAN[urlItem] : URLS_SCAN["x.com"];

        chrome.tabs.sendMessage(
          tab.id,
          {
            ...message,
            querySelector,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error sending message:",
                chrome.runtime.lastError.message,
              );
            } else {
              console.log("Response from content script:", response);
            }
          },
        );
      }
    });
  });
};

const sendAutoScan = () => {
  const message = { type: AUTO_SCAN_STATUS, autoScan };

  chrome.runtime.sendMessage(message);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
};

chrome.runtime.onMessage.addListener((message: MessageTypes) => {
  switch (message.type) {
    case UPDATE_AUTO_SCAN:
      if ("autoScan" in message) {
        autoScan = message.autoScan;
        chrome.storage.local.set({
          autoScan: message.autoScan,
        });
        sendAutoScan();
      }
      break;
    case UPDATE_MODERATION:
      if ("moderation" in message && message.moderation) {
        moderation = message.moderation;
        chrome.storage.local.set({ moderation: message.moderation });
        sendModeration();
      }
      break;
    default:
      break;
  }
});
