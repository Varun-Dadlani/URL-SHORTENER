import api from "../api/axios";

export default function UrlCard({ url, refresh }) {
  const shortUrl = `http://127.0.0.1:8000/${url.short_code}`;

  const disableUrl = async () => {
    await api.delete(`/urls/${url.id}`);
    refresh();
  };

  return (
    <div className="card">
      <p>{url.original_url}</p>
      <a href={shortUrl} target="_blank">{shortUrl}</a>
      <p>Clicks: {url.click_count}</p>
      <button onClick={() => navigator.clipboard.writeText(shortUrl)}>
        Copy
      </button>
      <button onClick={disableUrl}>Disable</button>
    </div>
  );
}
