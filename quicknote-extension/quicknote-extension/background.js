// Background script for QuickNote extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('QuickNote extension installed');
});

// Handle any background tasks here
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getNotes') {
    // Handle getting notes from storage
    chrome.storage.local.get(['notes'], (result) => {
      sendResponse({ notes: result.notes || [] });
    });
    return true; // Keep the message channel open for async response
  }
}); 