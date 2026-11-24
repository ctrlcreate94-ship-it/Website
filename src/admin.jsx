import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const BASE_URL = import.meta.env.BASE_URL;
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const result = response.status === 204 ? {} : await response.json();
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [currentPath, setCurrentPath] = useState("/");
  const [entries, setEntries] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function loadFiles(path) {
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest(`/api/admin/files?path=${encodeURIComponent(path)}`);
      setCurrentPath(result.currentPath);
      setEntries(result.entries);
    } catch (requestError) {
      setError(requestError.message);
      setEntries([]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    let active = true;
    apiRequest("/api/admin/session")
      .then(() => {
        if (!active) return;
        setAuthenticated(true);
        void loadFiles("/");
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setAuthenticated(true);
      setCredentials({ username: "", password: "" });
      await loadFiles("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    try {
      await apiRequest("/api/admin/logout", { method: "POST", body: "{}" });
    } finally {
      setAuthenticated(false);
      setSelectedImage(null);
      setNotice("");
    }
  }

  function chooseEntry(entry) {
    setNotice("");
    setError("");
    if (entry.type === "directory") {
      setSelectedImage(null);
      void loadFiles(entry.path);
      return;
    }
    setSelectedImage(entry);
    setTitle(entry.name.replace(/\.[^.]+$/, ""));
    setDescription("");
  }

  async function publish(event) {
    event.preventDefault();
    if (!selectedImage) return;
    setBusy(true);
    setNotice("");
    setError("");
    try {
      await apiRequest("/api/admin/publish", {
        method: "POST",
        body: JSON.stringify({ path: selectedImage.path, label: title, alt: description }),
      });
      setNotice(`${title} is now in the public portfolio.`);
      setSelectedImage(null);
      setTitle("");
      setDescription("");
      await loadFiles(currentPath);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) {
    return <main className="admin-page"><p className="admin-loading">Loading portfolio admin...</p></main>;
  }

  return (
    <div className="admin-page">
      <header className="admin-header section-wrap">
        <a className="brand" href={BASE_URL} aria-label="Parivaar Photography, home">
          <span className="brand__monogram" aria-hidden="true">P<span>.</span></span>
          <span className="brand__name"><span>Parivaar</span><span>Photography</span></span>
        </a>
        <div className="admin-header__actions">
          <span>Portfolio admin</span>
          {authenticated && <button className="admin-text-button" type="button" onClick={signOut}>Sign out</button>}
        </div>
      </header>

      {!authenticated ? (
        <main className="admin-login section-wrap">
          <p className="eyebrow"><span className="eyebrow__line" /> Private workspace</p>
          <h1>Sign in to<br /><em>your portfolio.</em></h1>
          <form className="admin-login__form" onSubmit={signIn}>
            <label className="form-field">
              <span>Username</span>
              <input autoComplete="username" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} required />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input autoComplete="current-password" type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required />
            </label>
            {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
            <button className="button" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
          </form>
        </main>
      ) : (
        <main className="admin-main section-wrap">
          <div className="admin-title-row">
            <div>
              <p className="eyebrow"><span className="eyebrow__line" /> Nextcloud library</p>
              <h1>Publish a <em>moment.</em></h1>
            </div>
            <p className="admin-title-row__note">Choose an image from Nextcloud, add its portfolio text, and publish it to the website.</p>
          </div>

          {(error || notice) && (
            <p className={`admin-message${error ? " admin-message--error" : " admin-message--success"}`} role={error ? "alert" : "status"}>
              {error || notice}
            </p>
          )}

          <div className="admin-workspace">
            <section className="admin-browser" aria-labelledby="library-title">
              <div className="admin-section-heading">
                <h2 id="library-title">Image library</h2>
                <span>{busy ? "Loading..." : `${entries.filter((entry) => entry.type === "file").length} images`}</span>
              </div>
              <div className="admin-breadcrumb">
                <span>{currentPath}</span>
                {currentPath !== "/" && (
                  <button
                    className="admin-text-button"
                    type="button"
                    onClick={() => {
                      const parts = currentPath.split("/").filter(Boolean);
                      void loadFiles(parts.length > 1 ? `/${parts.slice(0, -1).join("/")}` : "/");
                    }}
                  >
                    Parent folder
                  </button>
                )}
              </div>
              {entries.length ? (
                <div className="admin-file-grid">
                  {entries.map((entry) => (
                    <button
                      className={`admin-file${selectedImage?.path === entry.path ? " is-selected" : ""}`}
                      key={entry.path}
                      type="button"
                      onClick={() => chooseEntry(entry)}
                      aria-pressed={entry.type === "file" ? selectedImage?.path === entry.path : undefined}
                    >
                      {entry.type === "directory" ? (
                        <span className="admin-folder-icon" aria-hidden="true">DIR</span>
                      ) : (
                        <img src={entry.previewUrl} alt="" loading="lazy" />
                      )}
                      <span className="admin-file__name">{entry.name}</span>
                      <span className="admin-file__meta">{entry.type === "directory" ? "Folder" : `${(entry.size / 1024 / 1024).toFixed(1)} MB`}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">{busy ? "Reading this folder..." : "No supported images or folders in this location."}</p>
              )}
            </section>

            <section className="admin-publish" aria-labelledby="publish-title">
              <h2 id="publish-title">Portfolio details</h2>
              {selectedImage ? (
                <form className="admin-publish__form" onSubmit={publish}>
                  <img className="admin-publish__preview" src={selectedImage.previewUrl} alt="Selected image preview" />
                  <p className="admin-publish__filename">{selectedImage.name}</p>
                  <label className="form-field">
                    <span>Display title</span>
                    <input maxLength="100" value={title} onChange={(event) => setTitle(event.target.value)} required />
                  </label>
                  <label className="form-field">
                    <span>Image description</span>
                    <textarea maxLength="240" rows="3" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the important moment in this photo" required />
                  </label>
                  <button className="button" type="submit" disabled={busy}>{busy ? "Publishing..." : "Publish to website"}</button>
                </form>
              ) : (
                <p className="admin-empty">Select an image from the library to add its title and description.</p>
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<AdminPage />);
