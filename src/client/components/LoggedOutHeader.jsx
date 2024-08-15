import { Link } from 'react-router-dom';

function LoggedOutHeader() {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to={"/"} className="btn btn-ghost text-xl">Recipe App</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to={"/login"}>Login</Link></li>
                    <li><Link to={"/signup"}>Signup</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default LoggedOutHeader;