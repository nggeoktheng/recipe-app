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

        if (formValues.password !== formValues.confirm_password) {
            setErrorMsg("Passwords should match");
            return;
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
            <div className="container mx-auto">
                <div className="card card-side bg-base-100 shadow-xl mt-5">
                    <div className="card-body">
                        <form onSubmit={signupUser}>
                            <h2 className="card-title">Signup</h2>

                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>

                                <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                    <div className="sm:col-span-3">
                                    <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                                        First name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                    <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Last name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                    <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
                                        Birthday
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        autoComplete="bday"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div className="col-span-full">
                                    <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                                        About
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                        required
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                                    </div>

                                </div>


                                <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4 mb-2">Login Credential</h2>

                                <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                    <div className="sm:col-span-4">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                    <label htmlFor="confirm_password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Confirm Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        required
                                        id="confirm_password"
                                        name="confirm_password"
                                        type="password"
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>


                                </div>

                                <p className={`text-red-500 ${errorMsg.length ? '' : 'hidden'} pt-4`}>{errorMsg}</p>

                            </div>

                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary">Signup</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup;