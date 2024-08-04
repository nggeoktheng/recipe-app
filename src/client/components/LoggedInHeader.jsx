import { Link } from 'react-router-dom';

function LoggedInHeader() {
    return (
        <div className="header logged-out">
            <Link to={"/"}>Recipe App</Link>

            <div className="links">
                <Link to={"/add-recipe"}>Add Recipe</Link>
                <Link to={"/profile"}>Profile</Link>
                <Link to={"/logout"}>Logout</Link>
            </div>
        </div>
    )
}

export default LoggedInHeader;