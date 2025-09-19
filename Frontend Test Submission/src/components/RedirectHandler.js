import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUrls } from '../context/URLContext';
import { initializeAndAuthenticate, Log } from '@220240170063/logger';
import '../styles/Spinner.css';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const { urls, recordClick } = useUrls();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    Log('debug', 'component', `RedirectHandler mounted for shortcode: ${shortCode}`);
    const urlMapping = urls.find((url) => url.shortCode === shortCode);

    if (urlMapping) {
      const isExpired = new Date() > new Date(urlMapping.expiresAt);
      if (isExpired) {
        setStatus('error');
        Log('error', 'component', `Redirect failed: URL has expired. Shortcode: ${shortCode}`);
      } else {
        recordClick(shortCode);
        setStatus('success');
        Log('info', 'component', `Redirecting user for shortcode: ${shortCode} to ${urlMapping.longUrl}`);
        window.location.href = urlMapping.longUrl;
      }
    } else {
      setStatus('error');
      Log('error', 'component', `Redirect failed: Shortcode not found: ${shortCode}`);
    }
  }, [shortCode, urls, recordClick]);

  if (status === 'loading') {
    return (
      <div className="spinner-container" style={{ height: '80vh' }}>
        <div className="spinner"></div>
        <p style={{ marginLeft: '1rem' }}>Redirecting...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="alert alert-error" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h3>Link Not Found</h3>
        <p>The link you are trying to access does not exist or has expired.</p>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;