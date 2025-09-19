import React, { useState } from 'react';
import { useUrls } from '../context/URLContext';
import { nanoid } from 'nanoid';
import { initializeAndAuthenticate, Log } from '@220240170063/logger';
import '../styles/URLShortenerPage.css';

const URLShortenerPage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [validity, setValidity] = useState(30);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const { urls, addUrlMapping } = useUrls();

  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    if (!longUrl) {
      setError('The original URL cannot be empty.');
      Log('error', 'component', 'Validation failed: Attempted to shorten an empty URL.');
      return;
    }
    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      Log('error', 'component', `Validation failed: Invalid URL format provided: ${longUrl}`);
      return;
    }
    if (customShortCode && urls.some(url => url.shortCode === customShortCode)) {
      setError('This custom shortcode is already taken. Please choose another.');
      Log('warn', 'component', `Validation failed: Custom shortcode collision for: ${customShortCode}`);
      return;
    }
    if (customShortCode && !/^[a-zA-Z0-9_-]+$/.test(customShortCode)) {
       setError('Custom shortcode can only contain letters, numbers, hyphens, and underscores.');
       Log('warn', 'component', 'Validation failed: Invalid characters in custom shortcode.');
       return;
    }

    const shortCode = customShortCode || nanoid(7);
    const creationTime = new Date();
    const expirationTime = new Date(creationTime.getTime() + (validity || 30) * 60 * 1000);

    const newUrlMapping = {
      longUrl,
      shortCode,
      createdAt: creationTime.toISOString(),
      expiresAt: expirationTime.toISOString(),
      stats: [],
    };

    addUrlMapping(newUrlMapping);

    setSuccess({
        text: `Success! Your short URL is: `,
        shortCode: shortCode
    });
    Log('info', 'component', `URL shortened successfully: ${longUrl} -> /${shortCode}`);

    setLongUrl('');
    setCustomShortCode('');
    setValidity(30);
  };

  return (
    <div className="shortener-container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="longUrl">Original Long URL</label>
          <input
            id="longUrl"
            type="url"
            placeholder="https://example.com"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customShortCode">Optional Custom Shortcode</label>
          <input
            id="customShortCode"
            type="text"
            placeholder="e.g., 'my-link'"
            value={customShortCode}
            onChange={(e) => setCustomShortCode(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="validity">Optional Validity (in minutes)</label>
          <input
            id="validity"
            type="number"
            value={validity}
            onChange={(e) => setValidity(parseInt(e.target.value, 10))}
          />
          <p className="helper-text">Defaults to 30 minutes.</p>
        </div>
        <button type="submit" className="btn">Shorten URL</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">
          {success.text}
          <a href={`/${success.shortCode}`} target="_blank" rel="noopener noreferrer">
            {`${window.location.host}/${success.shortCode}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default URLShortenerPage;