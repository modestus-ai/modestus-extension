import * as _ from "lodash"
// document.body.style.background = "yellow"

async function test() {
  try {
    // var aTags = document.getElementsByTagName("span")
    // var searchText = "Bitcoin"
    // var foundElement

    // for (var i = 0; i < aTags.length; i++) {
    //   if (aTags[i].textContent === searchText) {
    //     foundElement = aTags[i]
    //     foundElement.style.color = "red" // Set the color to red

    //     // Create a new element to replace the foundElement
    //     var newElement = document.createElement("div")
    //     newElement.textContent = "Replaced element"
    //     newElement.style.color = "green"

    //     // Replace the foundElement with the new element
    //     foundElement.append.style.color = "#9FE870"
    //     break
    //   }
    // }

    // const src = chrome.runtime.getURL("js/content_script.js");
    // const contentMain = await import(src);
    // console.log("🚀 ~ test ~ contentMain:", contentMain)
    // const res = await axios.get("https://neststock.com", {
    //   headers: {}
    // });
    // console.log("🚀 ~ test ~ res:", res)
    console.log(_.clone(["test"]), "zz")

    const headers = {
      "Content-Type": "application/json",
      "moev-api-key": "e9c3185e-d0d8-49ba-a3da-9d2b4947c15a",
      accept: "application/json",
    }

    const bodyRequest = {
      request_id: "test_request_id",
      content: "You are trash",
      metrics: {
        unsafe:
          "content indicates or promotes hate, toxicity, racism or bias towards individual or group",
        joy: "Indicates happiness, pleasure, or satisfaction",
        // Joy: "Indicates happiness, pleasure, or satisfaction.",
        // Anger: " Indicates frustration, irritation, or rage.",
        // Sadness: "Indicates sorrow, disappointment, or grief.",
        // Surprise: "Indicates shock, amazement, or astonishment.",
        fear: "Indicates anxiety, worry, or concern.",
        // Disgust: "Indicates aversion, distaste, or repulsion.",
      },
      // {
      //   Joy: "Indicates happiness, pleasure, or satisfaction.",
      //   Anger: " Indicates frustration, irritation, or rage.",
      //   Sadness: "Indicates sorrow, disappointment, or grief.",
      //   Surprise: "Indicates shock, amazement, or astonishment.",
      //   Fear: "Indicates anxiety, worry, or concern.",
      //   Disgust: "Indicates aversion, distaste, or repulsion.",
      // },
    }

    // const response = await axios.post("https://api.modestus.ai/moderate/", bodyRequest, {
    //   headers: headers,
    // });

    chrome.runtime.sendMessage(
      { contentScriptQuery: "queryPrice", itemId: 12345 },
      (response) => {
        console.log(response, "RESPONSE HEREEEE")
        console.log("🚀 ~ test ~ response:", response)
      },
    )
  } catch (error) {
    console.log("🚀 ~ test ~ error:", error)
  }
}

test()
