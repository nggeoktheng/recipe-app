import React, { useState, useEffect } from "react";

function ProfileForm({ user, onSubmit }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        bio: "",
        dob: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                username: user.username || "",
                bio: user.bio || "",
                dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea name="bio" id="bio" value={formData.bio} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
            </div>
            <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
                <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Update Profile
                </button>
            </div>
        </form>
    )
}

export default ProfileForm;