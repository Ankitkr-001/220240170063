import React from 'react';
import { useUrls } from '../context/URLContext';
import '../styles/URLStatistivsPage.css';

const URLStatisticsPage = () => {
  const { urls } = useUrls();

  return (
    <div className="stats-container">
      <h1>URL Statistics</h1>
      {urls.length === 0 ? (
        <p>No URLs have been shortened yet.</p>
      ) : (
        <div className="stats-table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Original URL</th>
                <th style={{ textAlign: 'center' }}>Clicks</th>
                <th>Expires At</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.shortCode}>
                  <td><a href={`/${url.shortCode}`} target="_blank" rel="noopener noreferrer">{`${window.location.host}/${url.shortCode}`}</a></td>
                  <td className="original-url-cell"><a href={url.longUrl} target="_blank" rel="noopener noreferrer" title={url.longUrl}>{url.longUrl}</a></td>
                  <td style={{ textAlign: 'center' }}>{url.stats.length}</td>
                  <td>{new Date(url.expiresAt).toLocaleString()}</td>
                  <td>
                    <details className="details-widget">
                      <summary>View Clicks</summary>
                      <div className="click-details">
                        {url.stats.length > 0 ? (
                          url.stats.map((click, index) => (
                            <div key={index} className="click-item">
                              <strong>Timestamp:</strong> {new Date(click.timestamp).toLocaleString()}<br />
                              <strong>Source:</strong> {click.source}<br />
                              <strong>Location:</strong> {click.location}
                            </div>
                          ))
                        ) : (
                          <p>No clicks yet.</p>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default URLStatisticsPage;