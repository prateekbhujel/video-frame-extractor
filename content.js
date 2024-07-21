const filterContent = (tech) => {
  const videos = document.querySelectorAll('#contents ytd-rich-item-renderer');

  videos.forEach((video) => {
    const titleElement = video.querySelector('#video-title');
    if (titleElement) {
      const title = titleElement.textContent.toLowerCase();
      if (!title.includes(tech.toLowerCase())) {
        video.style.display = 'none';
      } else {
        video.style.display = '';
      }
    }
  });
};

const updateFilter = () => {
  chrome.storage.sync.get('techFilter', (data) => {
    filterContent(data.techFilter || '');
  });
};

// Initial filter application
updateFilter();

// Reapply filter periodically to handle dynamic content
setInterval(updateFilter, 5000);

// Listen for messages from background script to update filter
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateFilter') {
    filterContent(request.techFilter);
  }
});
