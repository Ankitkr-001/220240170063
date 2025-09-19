import React, { createContext, useState, useContext } from 'react';
import { Log } from '../logger';

const URLContext = createContext();

export const useUrls = () => {
  return useContext(URLContext);
};

export const URLProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);

  const addUrlMapping = (urlData) => {
    setUrls((prevUrls) => {
      const newUrls = [...prevUrls, urlData];
      Log('info', 'state', `New URL mapping added. Shortcode: ${urlData.shortCode}`);
      return newUrls;
    });
  };

  const recordClick = (shortCode) => {
    setUrls((prevUrls) =>
      prevUrls.map((url) => {
        if (url.shortCode === shortCode) {
          const newClick = {
            timestamp: new Date().toISOString(),
            source: document.referrer || 'Direct',
            location: 'Coarse-grained location (simulated)',
          };
          Log('info', 'state', `URL clicked. Shortcode: ${shortCode}`);
          return { ...url, stats: [...url.stats, newClick] };
        }
        return url;
      })
    );
  };

  const value = {
    urls,
    addUrlMapping,
    recordClick,
  };

  return <URLContext.Provider value={value}>{children}</URLContext.Provider>;
};