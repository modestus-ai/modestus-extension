import { SCAN_PAGE_STATUS, URLS_SCAN } from "./constants/moderate";
import { ModerationResponse, ModerationState } from "./types/moderate.types";

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Extension installed");
//   chrome.alarms.clearAll(() => {
//     console.log("Setting alarm");
//     chrome.alarms.create("scanContent", { periodInMinutes: 1 });
//   });
// });

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
const { START_SCAN, UPDATE_MODERATION } = SCAN_PAGE_STATUS;

let moderation: ModerationState = {
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
  const message = { action: START_SCAN, moderation };

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

chrome.runtime.onMessage.addListener((message: ModerationResponse) => {
  if (message.type === UPDATE_MODERATION) {
    moderation = message?.moderation;
    chrome.storage.local.set({ moderation });
    sendModeration();
  }
});
