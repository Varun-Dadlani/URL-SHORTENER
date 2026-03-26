const API_BASE = "http://127.0.0.1:8000";

if (!chrome.contextMenus) {
  console.error("contextMenus API not available");
}
// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: "shorten-link",
      title: "Shorten this link",
      contexts: ["link"]
    });
  }
});

if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "shorten-link") {
    chrome.storage.local.get("token", async (data) => {
      if (!data.token) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "URL Shortener",
          message: "Please login in the extension first"
        });
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/urls/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${data.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          original_url: info.linkUrl
        })
      });

      const result = await res.json();
      const shortUrl = `http://127.0.0.1:8000/${result.short_code}`;

      // save short url
      chrome.storage.local.set({ lastShortUrl: shortUrl });

      // 🔥 OPEN POPUP
      chrome.action.openPopup();
    });
  }
});


}


