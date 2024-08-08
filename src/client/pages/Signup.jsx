import { useState } from "react";
import LoggedOutHeader from "../components/LoggedOutHeader";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const getFormValues = (formValues) => {
        const { first_name, last_name, email, bio, dob, username, password, confirm_password } = formValues;
        const formValueObj = {
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            bio: bio.value,
            dob: dob.value,
            username: username.value,
            password: password.value,
            confirm_password: confirm_password.value
        }
        return formValueObj;
    }
    
    async function signupUser(evt) {
        evt.preventDefault();
        setErrorMsg("");

        const formValues = getFormValues(evt.target.elements);

        console.log("Submitted form: ", {
            formValues
        });

        if (formValues.password !== formValues.confirm_password) {
            setErrorMsg("Passwords should match");
        }

        try {
            const res = await fetch('/user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues)
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
                    <section>
                        <h3>Personal Information</h3>
                        <input type="text" name="first_name" placeholder="First Name" required />
                        <input type="text" name="last_name" placeholder="Last Name" required />
                        <input type="email" name="email" placeholder="Email" required />
                        <textarea name="bio" rows={5} placeholder="About yourself" />
                        <label htmlFor="dob">
                            Birthday: <input id="dob" type="date" name="dob" required />
                        </label>
                    </section>

                    <section>
                        <h3>Login Credentials</h3>
                        <input type="text" name="username" placeholder="Username" required />
                        <input type="password" name="password" placeholder="Password" required />
                        <input type="password" name="confirm_password" placeholder="Confirm Password" required />
                    </section>
                    <button type="submit">Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup;