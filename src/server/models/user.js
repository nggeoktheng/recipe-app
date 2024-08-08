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

export const loginUser = async(email, password) => {
    try {
        const userByEmail = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (userByEmail.length === 0) {
            throw new Error("User not found");
        }

        const result = await bcrypt.compare(password, userByEmail[0].password);

        if (!result) {
            throw new Error("Password does not match");
        }

        return {
            id: userByEmail[0].id,
            first_name: userByEmail[0].first_name,
            last_name: userByEmail[0].last_name,
            username: userByEmail[0].username,
            email: userByEmail[0].email
        };
    } catch (error) {
        console.log("Login database error: ", error);
        throw error;
    }
}