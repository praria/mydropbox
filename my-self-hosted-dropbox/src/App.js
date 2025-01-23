// React imports
import React from 'react';

import './App.css';
// Import Amplify core library and the configuration
import { Amplify } from 'aws-amplify';

// Import the authenticator and its styles
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Import custom components and styles
import FileUpload from './components/FileUpload';

// Import Amplify configuration
import config from './amplifyconfiguration.json';
Amplify.configure(config); // Ensure Amplify is configured before using it



// App component
function App({ signOut, user }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, {user.username}!</h1>
        <button onClick={signOut} className="sign-out-button">
          Sign Out
        </button>
        <h1>My Self-Hosted Dropbox</h1>
        <FileUpload />
      </header>
    </div>
  );
}

// Export the App component wrapped with the authenticator
export default withAuthenticator(App);
