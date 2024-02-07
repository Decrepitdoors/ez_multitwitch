// popup.js

document.getElementById("addStreamBtn").addEventListener("click", function () {
  console.log("Clicked Add to Multitwitch button");
  
  chrome.runtime.sendMessage({ action: "openMultitwitchTab" }, function (response) {
    console.log("Received response from openMultitwitchTab:", response);
    
    if (response && response.success) {
      console.log("Sending getStreamsCount message");
      chrome.runtime.sendMessage({ action: "getStreamsCount" }, function (countResponse) {
        console.log("Received response from getStreamsCount:", countResponse);
        // Display the count in your popup UI
        alert(`Total Streams Added: ${countResponse.count}`);
      });
    }
  });
});
