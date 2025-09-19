// YourRollNumber/Logging Middleware/logger.js

// In a real application, secrets should be managed by a backend or secure vault.
// For this frontend challenge, we'll store the token in memory.
let authToken = null;
let clientID = null;
let clientSecret = null;

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

/**
 * Registers the user, obtains clientID/clientSecret, and then authenticates to get a token.
 * This function should only be called once.
 * @param {object} registrationDetails - Contains email, name, rollNo, etc.
 * @returns {object} An object containing the clientID and clientSecret.
 * @throws {Error} If registration or authentication fails.
 */
export const initializeAndAuthenticate = async (registrationDetails) => {
  // 1. Register to get clientID and clientSecret
  console.log("Step 1: Attempting registration...");
  const regResponse = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationDetails),
  });

  const regData = await regResponse.json();
  if (!regResponse.ok) {
    throw new Error(regData.message || 'Registration failed');
  }
  
  console.log("Registration successful:", regData);
  clientID = regData.clientID;
  clientSecret = regData.clientSecret;

  // 2. Authenticate to get the Bearer token
  console.log("Step 2: Attempting authentication...");
  const authPayload = { ...registrationDetails, clientID, clientSecret };

  const authResponse = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authPayload),
  });

  const authData = await authResponse.json();
  if (!authResponse.ok) {
    throw new Error(authData.message || 'Authentication failed');
  }
  
  console.log("Authentication successful. Token received.");
  authToken = authData.access_token;
  
  // Return credentials for one-time display as per instructions
  return { clientID, clientSecret };
};

/**
 * Sends a log message to the evaluation API.
 * @param {string} level - e.g., 'info', 'error', 'debug'.
 * @param {string} pkg - The package/area of the code, e.g., 'component', 'hook', 'state'.
 * @param {string} message - The log message.
 * @throws {Error} If the logger is not authenticated or the API call fails.
 */
export const Log = async (level, pkg, message) => {
  if (!authToken) {
    console.error('Logging Error: Logger not initialized or authentication failed. Please authenticate first.');
    // In a real app, you might queue logs to send later. For this test, we stop.
    return;
  }

  const logPayload = {
    stack: 'frontend',
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(logPayload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        // Don't use the logger here to avoid an infinite loop if logging fails
        console.error('API Logging Failed:', errorData.message || 'Unknown error');
    } else {
        const successData = await response.json();
        console.log('Log successfully sent:', successData.logID);
    }
  } catch (error) {
    console.error('Network error while sending log:', error);
  }
};