chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-url",
    title: "Save URL to Side Panel",
    contexts: ["page"]
  });
});

//function showIndicator(tabId) {
    //chrome.tabs.get(tabId, tab => {
        //const currentUrl = normalize(tab.url);
//
        //chrome.storage.local.get("savedUrls", ({ savedUrls = [] }) => {
            //const match = savedUrls.some(u => normalize(u) === currentUrl);
            //chrome.action.setBadgeText({
                //tabId,
                //text: match ? "●" : ""
            //});
            //chrome.action.setBadgeBackgroundColor({ tabId, color: "#00FF00" });
        //});
    //});
//}

function sendMessage(message) {
  console.log({action: message})
  chrome.runtime.sendMessage(message, () => {
    if (chrome.runtime.lastError) {
      // This error is expected when the side panel is closed.
      // We can safely ignore it.
    }
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-url") {
    chrome.storage.local.get({urls: []}, (result) => {
      const urls = result.urls;
      if (!urls.includes(tab.url)) {
        urls.push(tab.url);
        chrome.storage.local.set({urls: urls}, () => {
          sendMessage({type: 'URL_SAVED'});
        });
      }
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) { // Only send on complete for active tab
    sendMessage({type: 'TAB_UPDATED'});
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  sendMessage({type: 'TAB_UPDATED'});
});
