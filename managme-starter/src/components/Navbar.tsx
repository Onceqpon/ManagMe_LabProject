import { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { UserSession } from '../services/UserSession';
import { User } from '../types/types';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const loggedUser = await UserSession.getLoggedUser();
      setUser(loggedUser);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <p className="logo-text">ManagMe - Projekty</p>
        </div>
        <div className="user">
          {isLoading ? (
            <p className="logged-user">Ładowanie użytkownika...</p>
          ) : user ? (
            <p className="logged-user">
              Zalogowany: {user.firstName} {user.lastName}
            </p>
          ) : (
            <p className="logged-user">Brak zalogowanego użytkownika</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;