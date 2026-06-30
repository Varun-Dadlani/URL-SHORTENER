const API_BASE = "https://url-shortner-tn0v.onrender.com";

const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");

const loginBtn = document.getElementById("loginBtn");
const shortenBtn = document.getElementById("shortenBtn");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");



// Load token if exists
chrome.storage.local.get("token", (data) => {
    if (data.token) {
        loginSection.style.display = "none";
        mainSection.style.display = "block";
    }
});

// LOGIN
loginBtn.onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginError = document.getElementById("loginError");

  loginError.textContent = ""; // clear old error

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username: email,
        password: password
      })
    });

    // ❌ WRONG CREDENTIALS
    if (!res.ok) {
      if (res.status === 401) {
        loginError.textContent = "Invalid email or password";
      } else {
        loginError.textContent = "Login failed. Try again.";
      }
      return; // ⛔ STOP here
    }

    // ✅ SUCCESS
    const data = await res.json();

    chrome.storage.local.set({ token: data.access_token }, () => {
      loginSection.style.display = "none";
      mainSection.style.display = "block";
    });

  } catch (err) {
    loginError.textContent = "Server error. Is backend running?";
    console.error(err);
  }
};


shortenBtn.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentUrl = tabs[0].url;
    if (
    !currentUrl ||
    currentUrl.startsWith("chrome://") ||
    currentUrl.startsWith("about:")
    ) {
    result.textContent = "No valid URL found for this page";
    copyBtn.style.display = "none";
    return; // ⛔ backend call mat karo
    }

    chrome.storage.local.get("token", async (data) => {
      if (!data.token) {
        result.textContent = "Please login first.";
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/urls/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${data.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            original_url: currentUrl
          })
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to shorten");
        }

        const urlData = await res.json();
        const shortUrl = `${API_BASE}/${urlData.short_code}`;

        result.textContent = shortUrl;
        copyBtn.style.display = "block";

        copyBtn.onclick = () => {
          navigator.clipboard.writeText(shortUrl);
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
        };
      } catch (e) {
        result.textContent = e.message;
      }
    });
  });
};

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = () => {
  chrome.storage.local.remove("token");
  location.reload();
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "COPY_URL") {
    navigator.clipboard.writeText(message.url);
    result.textContent = message.url;
    copyBtn.style.display = "block";
  }
});

chrome.storage.local.get("lastShortUrl", (data) => {
  if (data.lastShortUrl) {
    result.textContent = data.lastShortUrl;
    copyBtn.onclick = async () => {
    try {
        await navigator.clipboard.writeText(result.textContent);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
    } catch (e) {
        console.error("Copy failed", e);
    }
    };
    copyBtn.style.display = "block";
    chrome.storage.local.remove("lastShortUrl");
  }
});

