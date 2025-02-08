// import React from 'react';
// import './App.css';
// import { Amplify } from 'aws-amplify';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
// import FileUpload from './components/FileUpload';
// import config from './amplifyconfiguration.json';

// Amplify.configure(config);

// function App({ signOut, user }) {
//   const userEmail = user?.signInDetails?.loginId || user?.username || 'User';

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Hello, {userEmail}!</h1>
//         <button onClick={signOut} className="sign-out-button">
//           Sign Out
//         </button>
//         <FileUpload />
//       </header>
//     </div>
//   );
// }

// export default withAuthenticator(App);

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import FileUpload from './components/FileUpload';
import UserProfile from './components/UserProfile';
import config from './amplifyconfiguration.json';
import { Link } from 'react-router-dom';

Amplify.configure(config);

function App({ signOut, user }) {
  const userEmail = user?.signInDetails?.loginId || user?.username || 'User';

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>Hello, {userEmail}!</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/profile">Profile</Link>
          </nav>
          <button onClick={signOut} className="sign-out-button">
            Sign Out
          </button>
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default withAuthenticator(App);
