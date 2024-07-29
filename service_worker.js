import axios from 'axios';
// const {getChunks, newUUID} = require('./src/utils/common')
// import { scanPageContent } from './utils/scan'
// importScripts("./js.index.js");

// chrome.runtime.onMessage.addListener(async (msg, sender, res) => {
//   console.log("🚀 ~ chrome.runtime.onMessage.addListener ~ msg:", msg)
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   console.log("🚀 ~ onWindowLoad ~ tab:", chrome);
//   // scanPageContent()
//   setInterval(() => {
//     console.log("KEEP ALIVE")
//   }, 2000);
// });

chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    console.log("🚀 ~ request:", request)
    if (request.contentScriptQuery == "queryPrice") {
      console.log("REACH REQUEST BG");
      const res = await axios.get("https://neststock.com", {
        headers: {}
      });
      console.log("🚀 ~ test ~ res:", res)
      // var url = "https://another-site.com/price-query?itemId=" +
      //   encodeURIComponent(request.itemId);
      // fetch(url)
      //   .then(response => response.text())
      //   .then(text => parsePrice(text))
      //   .then(price => sendResponse(price))
      //   .catch(error => console.log())
      sendResponse("OKAY NHA")
      return true;  // Will respond asynchronously.
    }
  })