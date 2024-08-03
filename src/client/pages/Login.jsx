import { useState } from "react";
import LoggedOutHeader from "../components/LoggedOutHeader";

function Login() {
    const [errorMsg, setErrorMsg] = useState("");
    async function loginUser(evt) {
        evt.preventDefault();
        setErrorMsg("");
        const { email, password } = evt.target.elements;

        try {
            const res = await fetch("/user/login", {
                method: "POST",
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
                // handle success
            }

            if (data.error) {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg("Error trying to login, please try again in a few minutes.")
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