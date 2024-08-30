import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userDataLoader } from '../pages/Profile';

import defaultAvatarImg from '../assets/default.png';

function LoggedInHeader({ userImg, firstName }) {
    const [userFirstName, setFirstName] = useState(firstName);
    const [avatarImg, setAvatarImg] = useState(userImg || defaultAvatarImg);

    const loadUser = async () => {
        const user = await userDataLoader();

        if (user.first_name) {
            setFirstName(user.first_name);
        }

        if (user.profile_img) {
            setAvatarImg(`${user.profile_img}`);
        }
    }
    
    useEffect(() => {
        if (!firstName) {
            loadUser();
        }
    }, [firstName, userImg]);

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to={"/"} className="btn btn-ghost text-xl">Recipe App</Link>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img
                        alt={userFirstName}
                        src={avatarImg}
                        onError={() => setAvatarImg(defaultAvatarImg)} />
                    </div>
                </div>
                <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <Link to={'/profile'} className="justify-between">
                        Profile
                        </Link>
                    </li>
                    <li><Link to={"/add-recipe"}>Add Recipe</Link></li>
                    <li><Link to={"/logout"}>Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default LoggedInHeader;