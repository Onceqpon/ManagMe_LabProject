import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Zapis tokenów w localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Przekierowanie do głównego widoku
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Login</h1>
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="button button-primary">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;