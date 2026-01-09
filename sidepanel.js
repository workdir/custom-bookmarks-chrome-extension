import { renderUrlList } from './ui/url-list.js'
import { Urls } from './urls.js'

// Chrome api
//

const getActiveUrl = async () => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return activeTab ? activeTab.url : null;
}

async function displayUrls() {
    const urls = await Urls.getAll()
    const activeUrl = await getActiveUrl()

    renderUrlList(urls, activeUrl) 
}

// Register Events
//

const onEvent = (eventType) => {
  switch (eventType) {
    case "URL_SAVED":
    case "TAB_UPDATED":
      displayUrls()
      break;
    default:
      throw new Error(`behaviour not defined for this "${message.type}" event`)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  onEvent(message.type)
});

const initialScriptLoad = () => {
  displayUrls()
}

initialScriptLoad()

