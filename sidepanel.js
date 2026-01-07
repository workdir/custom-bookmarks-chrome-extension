const urlList = document.getElementById('url-list');

function displayUrls(urls, activeUrl) {
  urlList.innerHTML = '';
  for (const url of urls) {
    const listItem = document.createElement('li');

    if (url === activeUrl) {
      const dot = document.createElement('span');
      dot.classList.add('green-dot');
      listItem.appendChild(dot);
    }

    const link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    link.target = '_blank';
    listItem.appendChild(link);
    urlList.appendChild(listItem);
  }
}

async function loadUrls() {
  const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.storage.local.get({urls: []}, (result) => {
    displayUrls(result.urls, activeTab.url);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'URL_SAVED' || message.type === 'TAB_UPDATED') {
    loadUrls();
  }
});

loadUrls();
