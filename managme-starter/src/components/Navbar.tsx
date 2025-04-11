import "../styles/Navbar.css";
import { useAppLogic } from "../logicfunction/useAppLogic";

function Navbar() {
    const { user } = useAppLogic();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo"><p className="logo-text">ManagMe - Projekty</p></div>
        <div className="user"><p className="logged-user">Zalogowany: {user.firstName} {user.lastName}</p></div>
      </div>
    </nav>
  );
}

export default Navbar;
