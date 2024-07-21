document.getElementById('setFilter').addEventListener('click', () => {
  const tech = document.getElementById('techSelect').value;
  chrome.runtime.sendMessage({ action: 'setFilter', tech: tech });
});
