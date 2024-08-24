import bcrypt from "bcrypt";
import sql from "../database.js";

const saltRounds = 10;

export const createUser = async ({
    first_name,
    last_name,
    email,
    username,
    password,
    bio,
    dob
}) => {
    try {
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (existingUser.length > 0) {
            // User already exists
            throw new Error("User with this email already exists");
        }

        const hash = bcrypt.hashSync(password, saltRounds);

        const newUser = await sql`
            insert into users
            ( first_name, last_name, password, email, username, bio, dob )
            values
            ( ${first_name}, ${last_name}, ${hash}, ${email}, ${username}, ${bio}, ${dob} )
            returning id, first_name, last_name, username, email, dob`;

        if (newUser.length) {
            return newUser[0];
        }

        throw new Error("Error creating user");
    } catch (error) {
        console.log("Database error: ", error);
        // re-throw the error to return an error to the frontend
        throw error;
    }
}

export const loginUser = async(username, password) => {
    try {
        const userByUsername = await sql`SELECT * FROM users WHERE username = ${username}`;

        if (userByUsername.length === 0) {
            throw new Error("User not found");
        }

        const result = await bcrypt.compare(password, userByUsername[0].password);

        if (!result) {
            throw new Error("Password does not match");
        }

        return {
            id: userByUsername[0].id,
            first_name: userByUsername[0].first_name,
            last_name: userByUsername[0].last_name,
            username: userByUsername[0].username,
            email: userByUsername[0].email
        };
    } catch (error) {
        console.log("Login database error: ", error);
        throw error;
    }
}

export const getUserProfile = async (userId) => {
    try {
        const userProfile = await sql`SELECT * FROM users WHERE id = ${userId}`;

        console.log("Got user: ", {userProfile: userProfile[0]});
        const userToReturn = userProfile[0];
        delete userToReturn.password;

        return userToReturn;
    } catch (error) {
        throw error;
    }
}

export const setUserAvatar = async (avatarImgUrl, userId) => {
    try {
        const result = await sql`
            UPDATE users
            SET profile_img = ${avatarImgUrl}
            WHERE id = ${userId}
            RETURNING *;
        `;

        const updatedUser = result[0];
        delete updatedUser.password;
        return updatedUser;
    } catch (error) {
        console.error("Error updating avatar: ", error);
        throw error;
    }
}

export const updateUserProfile = async (userId, updatedInfo) => {
    try {
        const { first_name, last_name, username, bio, dob } = updatedInfo;
        const result = await sql`
            UPDATE users
            SET
                first_name = ${first_name},
                last_name = ${last_name},
                username = ${username},
                bio = ${bio},
                dob = ${dob}
            WHERE id = ${userId}
            RETURNING id, first_name, last_name, username, bio, dob, email, profile_img
        `;
        return result[0];
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}