import { useState } from "react";
import LoggedOutHeader from "../components/LoggedOutHeader";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    
    async function signupUser(evt) {
        evt.preventDefault();
        setErrorMsg("");
        const { name, email, password, confirm_password } = evt.target.elements;

        // Handle form validation
        if (confirm_password.value !== password.value) {
            setErrorMsg("Passwords need to match");
            return;
        }

        try {
            const res = await fetch('/user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    confirm_password: confirm_password.value
                })
            });
            const data = await res.json();
            if (data.success) {
                navigate("/login");
            }

            if (data.error) {
                setErrorMsg(data.error);
            }
        } catch (error) {
            setErrorMsg("Error trying to signup, please try again in a few minutes.");
        }
    }
    return (
        <>
            <LoggedOutHeader />
            <div className="signup-container">
                <h1>Signup</h1>
                <div className={`error ${errorMsg.length ? "show" : ""}`}>{errorMsg}</div>
                <form onSubmit={signupUser}>
                    <input type="text" name="name" placeholder="Name" />
                    <input type="email" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="confirm_password" placeholder="Confirm Password" />
                    <button type="submit">Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup;