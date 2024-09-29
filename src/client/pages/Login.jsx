import { useState } from "react";
import LoggedOutHeader from "../components/LoggedOutHeader";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    async function loginUser(evt) {
        console.log(evt);
        evt.preventDefault();
        setErrorMsg("");
        const { username, password } = evt.target.elements;

        try {
            const res = await fetch("/user/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                })
            });
            const data = await res.json();
            
            if (data.success) {
                window.location.reload(true);
                navigate("/");
            }

            if (data.error) {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg("Error trying to login, please try again in a few minutes.");
        }
    }
    return (
        <>
            <LoggedOutHeader />
            <div className="container mx-auto">
                <div className="card bg-base-100 w-96 shadow-xl mx-auto self-center mt-5">
                    <div className="card-body">
                        <h2 className="card-title">Login</h2>
                        <div className={`text-red-500 ${errorMsg.length ? '' : 'hidden' }`}>{errorMsg}</div>
                        <form onSubmit={loginUser}>
                            {/* Username */}
                            <label className="input input-bordered flex items-center gap-2 mb-2">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="text" name="username" className="grow" placeholder="Username" />
                            </label>

                            {/* Password */}
                            <label className="input input-bordered flex items-center gap-2 mb-2">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                                </svg>
                                <input type="password" name="password" className="grow" placeholder="Password" />
                            </label>

                            <div className="flex justify-end items-center">
                                <Link to={'/signup'} className='link link-secondary pr-2'>Signup</Link>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;