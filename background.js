const updateContentFilter = (tech) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'updateFilter', techFilter: tech });
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setTechFilter') {
    chrome.storage.sync.set({ techFilter: request.techFilter }, () => {
      updateContentFilter(request.techFilter);
    });
  }
});
