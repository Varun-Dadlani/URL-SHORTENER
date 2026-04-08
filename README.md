# URL Shortener & Extension 🔗⚡

A fast, full-stack URL shortening service equipped with a web frontend, a powerful backend API, and a handy browser extension for quick, on-the-go link shrinking.

## 📖 Overview
Long, clunky URLs can be difficult to share and track. This application allows users to convert long web addresses into concise, easily shareable links. Furthermore, the included browser extension allows users to shorten the URL of their current active tab with a single click.

## 📂 Repository Structure

* **`backend/`**
  The server-side application (built with Python). Handles URL generation algorithms, redirection logic, database storage, and API endpoints.
* **`frontend/src/`**
  The web interface (JavaScript/HTML/CSS) where users can manually paste long links, manage their shortened URLs, and view analytics.
* **`extension/`**
  The code for the Chrome browser extension, providing instant URL shortening right from your browser toolbar.

## 🛠️ Tech Stack
* **Backend:** Python (FastAPI)
* **Frontend:** React
* **Extension:** Standard Web Extension APIs (JS/HTML/Manifest)

---
## 🗂️ Project Structure

```
URL_SHORTNER/
├── backend/                  
│   ├── alembic/              
│   ├── app/                  
│   ├── venv/                 
│   ├── .env                  
│   └── alembic.ini           
├── extension/                
│   ├── background.js         
│   ├── icon.png              
│   ├── manifest.json         
│   ├── popup.css             
│   ├── popup.html            
│   └── popup.js              
├── frontend/                
│   ├── node_modules/         
│   ├── public/               
│   ├── src/                  
│   ├── package-lock.json    
│   ├── package.json          
│       
├── .gitignore                
└── README.md                 
```
---

## ⭐ Contributing

Feel free to fork this project and improve the template!

---

## 📄 License

MIT License

---