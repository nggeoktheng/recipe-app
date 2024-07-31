import { Link } from 'react-router-dom';

function LoggedOutHeader() {
    return (
        <div className="header logged-out">
            <Link to={"/"}>Recipe App</Link>

            <div className="links">
                <Link to={"/login"}>Login</Link>
                <Link to={"/signup"}>Signup</Link>
            </div>
        </div>
    )
}

export default LoggedOutHeader;