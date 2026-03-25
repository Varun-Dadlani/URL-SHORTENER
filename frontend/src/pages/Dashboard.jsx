import { useEffect, useState } from "react";
import api from "../api/axios";
import UrlCard from "../components/UrlCard";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [longUrl, setLongUrl] = useState("");

  const fetchUrls = async () => {
    const res = await api.get("/urls/");
    setUrls(res.data);
  };

  const handleLogout=()=>{
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  const createUrl = async () => {
    await api.post("/urls/", { original_url: longUrl });
    setLongUrl("");
    fetchUrls();
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
}, []);

const toggleTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};


  return (
  <div className="container">
    <header className="header">
      <h2>My URLs</h2>

      <div className="actions">
        <button className="secondary" onClick={toggleTheme}>
          🌓 Theme
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>

    <div className="create-box">
      <input
        placeholder="Paste long URL"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />
      <button onClick={createUrl}>Shorten</button>
    </div>

    {urls.map((url) => (
      <UrlCard key={url.id} url={url} refresh={fetchUrls} />
    ))}
  </div>
);

}
