import { useState } from "react";
import LoggedOutHeader from "../components/LoggedOutHeader";
import { useNavigate } from "react-router-dom";

function Login() {
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    async function loginUser(evt) {
        evt.preventDefault();
        setErrorMsg("");
        const { email, password } = evt.target.elements;

        try {
            const res = await fetch("/user/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            });
            const data = await res.json();
            
            if (data.success) {
                navigate("/profile");
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
            <h1>Login</h1>
            <div className={`error ${errorMsg.length ? "show" : "" }`}>{errorMsg}</div>
            <form onSubmit={loginUser}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login;