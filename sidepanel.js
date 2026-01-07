const urlList = document.getElementById('url-list');
let savedUrls = [];

async function displayUrls() {
  const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
  const currentActiveUrl = activeTab ? activeTab.url : null;

  urlList.innerHTML = '';
  for (const url of savedUrls) {
    const listItem = document.createElement('li');

    if (url === currentActiveUrl) {
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

async function loadAndDisplayUrls() {
  chrome.storage.local.get({urls: []}, (result) => {
    savedUrls = result.urls;
    displayUrls();
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'URL_SAVED') {
    loadAndDisplayUrls();
  } else if (message.type === 'TAB_UPDATED') {
    // When tab updates, just re-display based on current active tab
    displayUrls();
  }
});

loadAndDisplayUrls();
