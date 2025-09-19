import React, { useState } from 'react';
// Correctly import from the package in the sibling folder
import { initializeAndAuthenticate } from '@220240170063/logger'; 
import '../styles/AuthSetup.css';
import '../styles/Spinner.css';

const AuthSetup = ({ onAuthSuccess }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const handleAuth = async () => {
    setIsLoading(true);
    setError('');
    setCredentials(null);

    const registrationDetails = {
      email: process.env.REACT_APP_EMAIL,
      name: process.env.REACT_APP_NAME,
      mobileNo: process.env.REACT_APP_MOBILENO,
      githubUsername: process.env.REACT_APP_GITHUB_USERNAME,
      rollNo: process.env.REACT_APP_ROLLNO,
      accessCode: process.env.REACT_APP_ACCESS_CODE,
    };
    
    for (const key in registrationDetails) {
        if (!registrationDetails[key]) {
            setError(`Error: ${key} is missing in your .env.local file.`);
            setIsLoading(false);
            return;
        }
    }

    try {
      // The function call itself does not change
      const creds = await initializeAndAuthenticate(registrationDetails);
      setCredentials(creds);
      onAuthSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Logger Authentication</h1>
      <p>
        Click to authenticate with the test server using credentials from your <code className="code">.env.local</code> file.
      </p>

      <button className="btn" onClick={handleAuth} disabled={isLoading}>
        {isLoading ? <div className="spinner button-spinner"></div> : 'Initialize Logger'}
      </button>

      {error && <div className="alert alert-error">{error}</div>}

      {credentials && (
        <div className="alert alert-success">
          <div className="auth-credentials">
            <h3>Authentication Successful!</h3>
            <p>Please save your credentials. You will not be able to retrieve them again.</p>
            <ul>
              <li><strong>Client ID:</strong> <span>{credentials.clientID}</span></li>
              <li><strong>Client Secret:</strong> <span>{credentials.clientSecret}</span></li>
            </ul>
            <p>You can now use the URL Shortener.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthSetup;
