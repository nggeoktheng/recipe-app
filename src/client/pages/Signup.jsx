import { useState } from "react";
import LoggedOutHeader from "../components/LoggedOutHeader";

function Signup() {
    const [errors, setErrors] = useState({});
    async function signupUser(evt) {
        evt.preventDefault();
        setErrors({});
        console.log("signup user: ", evt);
        const { name, email, password, confirm_password } = evt.target.elements;

        console.log("values: ", {
            name: name.value,
            email: email.value,
            password: password.value,
            confirm_password: confirm_password.value
        });

        if (confirm_password.value !== password.value) {
            setErrors({
                confirm_password: "Passwords need to match"
            });
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
            console.log("result: ", data);
        } catch (error) {
            console.log("error: ", error);
        }
    }
    return (
        <>
            <LoggedOutHeader />
            <div className="signup-container">
                <h1>Signup</h1>
                <form onSubmit={signupUser}>
                    <input type="text" name="name" placeholder="Name" />
                    <input type="email" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="confirm_password" className={errors?.confirm_password ? "error" : ""} placeholder="Confirm Password" />
                    <button type="submit">Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup;