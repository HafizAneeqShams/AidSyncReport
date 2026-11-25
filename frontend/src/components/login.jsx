import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginClick = () => {
    // Yahan exact username aur password check ho raha hai
   if (username.trim() === "aneeqshams" && password.trim() === "aneeq098123") {
      setError("");
      onLogin(); // Login successful
    } else {
      setError("Invalid username or password. Access Denied!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>AidSyncReport</h1>
        <p>Secure Documentation Portal</p>
        
        {error && <div className="login-error">{error}</div>}

        <div className="input-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter username" 
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
            onKeyDown={(e) => e.key === 'Enter' && handleLoginClick()} // Enter dabane pe bhi login ho
          />
        </div>

        <button type="button" onClick={handleLoginClick} className="login-btn">
          Login to Portal
        </button>
      </div>
    </div>
  );
}