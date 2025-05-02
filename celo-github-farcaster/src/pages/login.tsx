import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    document.cookie = `username=${username}; path=/`;
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login with GitHub</h1>
      <input 
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>Login</button>
    </div>
  );
}
