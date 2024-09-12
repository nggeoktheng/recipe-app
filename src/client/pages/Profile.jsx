import { useLoaderData, useNavigate } from "react-router-dom";
import LoggedInHeader from "../components/LoggedInHeader";
import { Avatar } from "@files-ui/react";
import defaultAvatarImg from "../assets/default.png";
import ProfileForm from "../components/ProfileForm";
import { useState, useEffect } from "react";

export async function userDataLoader() {
    const res = await fetch("/user/profile", {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        if (res.status === 401) return redirect("/login");
        throw new Error("Failed to fetch user profile");
    }
    return res.json();
}

function Profile() {
    const [user, setUser] = useState(useLoaderData());
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    const handleProfileUpdate = async (updatedProfile) => {
        try {
            const response = await fetch("/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProfile),
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to update profile");
            const data = await response.json();
            navigate(0); // Refresh the page to show updated data
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const response = await fetch("/user/avatar", {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to upload avatar");
            const updatedUser = await response.json();
            setUser(prevUser => ({ ...prevUser, ...updatedUser }));
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) return <div>Error: Failed to load user data</div>;

    return (
        <>
            <LoggedInHeader userImg={user.profile_img} firstName={user.first_name } />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">User Profile</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 p-8 bg-gray-50 flex flex-col items-center justify-start">
                            <div className="relative mb-6">
                                <Avatar
                                src={user.profile_img ? user.profile_img : defaultAvatarImg}
                                onChange={(file) => handleAvatarUpload(file)}
                                alt="Profile"
                                className="w-40 h-40 rounded-full"
                                changeLabel=""
                                />
                                <button 
                                onClick={() => document.getElementById('avatar-input').click()} 
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                </button>
                                <input 
                                id="avatar-input" 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleAvatarUpload(e.target.files[0])} 
                                accept="image/*"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-center">{user.first_name} {user.last_name}</h2>
                            <p className="text-gray-600 mt-1 mb-4">@{user.username}</p>
                            <div className="w-full mt-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                                <p className="text-gray-600">{user.bio || 'No bio available'}</p>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <ProfileForm user={user} onSubmit={handleProfileUpdate} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;