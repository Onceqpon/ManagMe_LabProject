import { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { UserSession } from '../services/UserSession';
import { User } from '../types/types';

function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedUser = UserSession.getLoggedUser();
    setUser(loggedUser);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <p className="logo-text">ManagMe - Projekty</p>
        </div>
        <div className="user">
          {user ? (
            <p className="logged-user">
              Zalogowany: {user.firstName} {user.lastName}
            </p>
          ) : (
            <p className="logged-user">Ładowanie użytkownika...</p>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;