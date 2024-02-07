// content.js

function addToSelectedStreams(streamUrl, sendResponse) {
  console.log("Received addToSelectedStreams request in content script:", streamUrl);
  chrome.runtime.sendMessage({ action: "addToSelectedStreams", streamUrl: streamUrl }, function (response) {
    console.log("Background script response:", response);
    sendResponse(response);
  });
  return true; // Indicates that sendResponse will be called asynchronously
}
