import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { postLocation } from '../spotifyAuth';

export const NavBar = (props) => {
  return (
    <nav>
      <div className="nav-item">
        <a id="home" href={window.location.origin}>
          <FontAwesomeIcon id="home-icon" icon={faHouseUser} />
        </a>
      </div>
    </nav>
  );
};
