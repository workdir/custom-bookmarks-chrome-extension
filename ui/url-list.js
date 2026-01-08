export const renderUrlList = (urls, activeUrl) => {
  const urlList = document.getElementById('url-list');

  if(!urlList) throw new Error('url-list dom node not found. Recomended - Update static html.')

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
