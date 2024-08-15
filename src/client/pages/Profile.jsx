import { redirect, useLoaderData } from "react-router-dom";
import LoggedInHeader from "../components/LoggedInHeader";

import styles from "./profile.module.css";
import { Avatar } from "@files-ui/react";
import { useState } from "react";
import defaultAvatarImg from "../assets/default.png";

export async function userDataLoader() {
    try {
        const res = await fetch("/user", {
            method: "GET",
            credentials: "include"
        })
        const data = await res.json();
        return data.user;
    } catch (error) {
        return redirect("/login");
    }
}

async function uploadImage(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const res = await fetch("/user/avatar", {
            method: "POST",
            credentials: "include",
            body: formData
        })
        const data = await res.json();
    } catch (error) {
        console.log("got error: ", error);
    }
}

function Profile() {
    const user = useLoaderData();
    const [avatarImg, setAvatarImg] = useState(`/uploads/${user.profile_img}`);

    const handleAvatarImageChange = (avatarFile) => {
        setAvatarImg(avatarFile);
        uploadImage(avatarFile);
    }

    console.log("User data: ", user);

    return (
        <>
            <LoggedInHeader userImg={user.profile_img ? `/uploads/${user.profile_img}` : null} firstName={user.first_name} />
            <div className="{styles.profile">
                <h2>Welcome {user.first_name}</h2>
                <Avatar 
                    // readOnly={isEditingAvatar}
                    alt={`${user.first_name}`}
                    src={avatarImg}
                    onError={() => setAvatarImg(defaultAvatarImg)}
                    changeLabel="Upload image"
                    onChange={handleAvatarImageChange}
                />
            </div>
        </>
    )
}

export default Profile;