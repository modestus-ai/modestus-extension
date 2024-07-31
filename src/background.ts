// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Extension installed");
//   chrome.alarms.clearAll(() => {
//     console.log("Setting alarm");
//     chrome.alarms.create("scanContent", { periodInMinutes: 1 });
//   });
// });

import { ModerationState } from "./types/moderate.types";

// chrome.alarms.onAlarm.addListener(async (alarm) => {
//   if (alarm.name === "scanContent") {
//     let tabs: any = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });
//     for (let tab of tabs) {
//       chrome.tabs.sendMessage(
//         tab.id,
//         {
//           action: "startScan",
//           moderation: moderationState,
//         },
//         (response) => {
//           if (chrome.runtime.lastError) {
//             console.error(
//               "Error sending message:",
//               chrome.runtime.lastError.message,
//             );
//           } else {
//             console.log("Response from content script:", response);
//           }
//         },
//       );
//     }
//   }
// });

const urls: any = {
  "x.com": '[data-testid="tweetText"]',
  "reddit.com": '[slot="comment"]',
};

let moderation = {
  policies: [],
};

chrome.storage.local.get("moderation", (res) => {
  if (res["moderation"]) {
    moderation = res["moderation"];
  } else {
    moderation = {
      policies: [],
    };
  }
});

const sendModeration = () => {
  const message = { action: "START_SCAN", moderation };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        const urlItem = Object.keys(urls).find((url) => tab.url?.includes(url));
        const querySelector = urlItem ? urls[urlItem] : urls["x.com"];

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

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "REQ_LOADING") {
    chrome.runtime.sendMessage({ type: "LOADING_STATUS", isLoading: true });
  }
  if (message.type === "UPDATE_MODERATION") {
    moderation = message?.moderation;
    chrome.storage.local.set({ moderation });
    sendModeration();
  }
});
