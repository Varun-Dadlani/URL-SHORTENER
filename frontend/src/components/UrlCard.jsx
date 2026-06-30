import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UrlCard({ url, refresh }) {
  const shortUrl = `https://url-shortner-tn0v.onrender.com/${url.short_code}`;
  const [clickCount, setClickCount] = useState(url.click_count);

  useEffect(() => {
    setClickCount(url.click_count);
  }, [url.click_count]);

  const disableUrl = async () => {
    await api.delete(`/urls/${url.id}`);
    refresh();
  };

  const handleOpenShortUrl = (event) => {
    event.preventDefault();
    setClickCount((prev) => prev + 1);
    window.open(shortUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="card">
      <p>{url.original_url}</p>
      <a href={shortUrl} target="_blank" rel="noopener noreferrer" onClick={handleOpenShortUrl}>
        {shortUrl}
      </a>
      <p>Clicks: {clickCount}</p>
      <button onClick={() => navigator.clipboard.writeText(shortUrl)}>
        Copy
      </button>
      <button onClick={disableUrl}>Disable</button>
    </div>
  );
}
