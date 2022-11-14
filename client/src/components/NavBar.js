import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse as houseIcon } from '@fortawesome/free-solid-svg-icons';
import { postLocation } from '../spotifyAuth';

export const NavBar = (props) => {
  return (
    <nav>
      <div className="nav-item">
        <a id="home" href={window.location.origin}>
          <FontAwesomeIcon id="home-icon" icon={houseIcon} />
        </a>
      </div>
    </nav>
  );
};
