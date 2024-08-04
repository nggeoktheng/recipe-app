import { Link } from 'react-router-dom';

function LoggedInHeader() {
    return (
        <div className="header logged-out">
            <Link to={"/"}>Recipe App</Link>

            <div className="links">
                <Link to={"/logout"}>Logout</Link>
                <Link to={"/profile"}>Profile</Link>
            </div>
        </div>
    )
}

export default LoggedInHeader;