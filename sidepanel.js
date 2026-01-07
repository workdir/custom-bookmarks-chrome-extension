const urlList = document.getElementById('url-list');

function displayUrls(urls) {
  urlList.innerHTML = '';
  for (const url of urls) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    link.target = '_blank';
    listItem.appendChild(link);
    urlList.appendChild(listItem);
  }
}

function loadUrls() {
  chrome.storage.local.get({urls: []}, (result) => {
    displayUrls(result.urls);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'URL_SAVED') {
    loadUrls();
  }
});

loadUrls();
