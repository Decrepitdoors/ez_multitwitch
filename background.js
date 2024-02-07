// background.js

let selectedStreams = [];
let streamsCount = 0;

function addToSelectedStreams(username) {
  console.log("Adding stream to selectedStreams:", username);
  if (!selectedStreams.includes(username)) {
    selectedStreams.push(username);
    streamsCount++;
    updateBadge();
  } else {
    console.log("User already added:", username);
  }
}

function openMultitwitchTab() {
  const multitwitchUrl = `https://www.multitwitch.tv/${selectedStreams.join('/')}`;
  console.log("Opening Multitwitch tab with usernames:", selectedStreams);
  
  chrome.tabs.create({ url: multitwitchUrl }, function () {
    // Reset streamsCount after opening the Multitwitch tab
    streamsCount = 0;
    updateBadge();
  });
}

// Extract Username
function extractUsernameFromUrl(url) {
  try {
    const urlObject = new URL(url);
    const pathArray = urlObject.pathname.split('/');
    const username = pathArray[1]; // The username should be the second element in the path
    return username || null;
  } catch (error) {
    console.error("Error extracting username:", error.message);
    return null;
  }
}

function createContextMenu() {
  console.log("Creating context menu");
  chrome.contextMenus.create({
    id: "multitwitchContextMenu",
    title: "Add to Multitwitch",
    contexts: ["link"],
  });
}

function getStreamsCount() {
  return streamsCount;
}

function updateBadge() {
  if (chrome.action) {
    const count = getStreamsCount();
    const badgeText = count > 0 ? count.toString() : "";
    chrome.action.setBadgeText({ text: badgeText });
  } else {
    console.error("chrome.action is not defined.");
  }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getUsername") {
    if (request.url) {
      const username = extractUsernameFromUrl(request.url);
      if (username) {
        console.log("Retrieved username:", username);
        sendResponse({ username: username });
      } else {
        console.error("Failed to retrieve username from the URL.");
        sendResponse({ error: "Failed to retrieve username" });
      }
    } else {
      console.error("URL not provided in the request.");
      sendResponse({ error: "URL not provided" });
    }
    return true; // Needed to keep the message channel open for sendResponse
  }
  
  if (request.action === "openMultitwitchTab") {
    openMultitwitchTab();
    sendResponse({ success: true });
  }

  if (request.action === "getStreamsCount") {
    const count = getStreamsCount();
    sendResponse({ count: count });
  }
});

// Add a listener for the context menu item click
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "multitwitchContextMenu") {
    const username = extractUsernameFromUrl(info.linkUrl || "");
    if (username) {
      addToSelectedStreams(username);
      console.log("Added stream to Multitwitch:", username);
    } else {
      console.error("Invalid username:", username);
    }
  }
});

chrome.runtime.onInstalled.addListener(createContextMenu);
