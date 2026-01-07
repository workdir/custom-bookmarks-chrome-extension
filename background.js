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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-url") {
    chrome.storage.local.get({urls: []}, (result) => {
      const urls = result.urls;
      if (!urls.includes(tab.url)) {
        urls.push(tab.url);
        chrome.storage.local.set({urls: urls}, () => {
          chrome.runtime.sendMessage({type: 'URL_SAVED'});
        });
      }
    });
  }
});
