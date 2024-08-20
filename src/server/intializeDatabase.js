import sql from "./database.js";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

// Create app_metadata table 
const createAppMetadataTable = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS app_metadata (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    `;
};

// Check if the database has been seeded or not
const checkIfSeeded = async () => {
    const result = await sql`
        SELECT value FROM app_metadata WHERE key = 'seeded'
    `;
    return result.length > 0 && result[0].value === 'true';
};

// If the database is not seeded, create the data
// Mark the database as seeded once the seeding process has been completed
const markAsSeeded = async () => {
    await sql`
        INSERT INTO app_metadata (key, value)
        VALUES ('seeded', 'true')
        ON CONFLICT (key) DO UPDATE SET value = 'true'
    `;
};

// Create a new user in the users table
const createUser = async (username, email) => {
    const hashedPassword = await bcrypt.hash('Testing1', 10);
    const [user] = await sql`
        INSERT INTO users (username, email, password)
        VALUES (${username}, ${email}, ${hashedPassword})
        RETURNING id
    `;
    return user.id;
}; 

const fetchRecipeFromMealDB = async () => {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        const meal = data.meals[0];
    
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
            }
        }
    
        return {
            title: meal.strMeal,
            ingredients: JSON.stringify(ingredients),
            steps: meal.strInstructions,
            cooking_time: "30 minutes",
            image_url: meal.strMealThumb
        };
    } catch (error) {
        console.error("Error fetching recipe from MealDB: ", error);
        return null;
    }
};

const createRecipe = async (userId) => {
    const recipe = await fetchRecipeFromMealDB();
    if (!recipe) return null;
  
    recipe.user_id = userId;
  
    const [newRecipe] = await sql`
        INSERT INTO recipes ${sql(recipe)}
        RETURNING id
    `;
    return newRecipe.id;
};

const addStarToRecipe = async (userId, recipeId) => {
    await sql`
        INSERT INTO starred (user_id, recipe_id)
        VALUES (${userId}, ${recipeId})
        ON CONFLICT DO NOTHING
    `;
};

const addCommentToRecipe = async (userId, recipeId) => {
    await sql`
        INSERT INTO comments (user_id, recipe_id, comment)
        VALUES (${userId}, ${recipeId}, ${faker.lorem.sentence()})
    `;
};

const seedDatabase = async () => {
    if (await checkIfSeeded()) {
        console.log("Database already seeded. Skipping seeding process.");
        return;
    }
  
    const users = [];
    for (let i = 0; i < 5; i++) {
        const userId = await createUser(
            faker.internet.userName(),
            faker.internet.email()
        );
        users.push(userId);
    
        const recipeCount = faker.number.int({ min: 5, max: 10 });
        for (let j = 0; j < recipeCount; j++) {
            const recipeId = await createRecipe(userId);
            if (recipeId) {
                // Add stars and comments
                for (let k = 0; k < users.length; k++) {
                    if (faker.number.int({ min: 0, max: 1 })) {
                    await addStarToRecipe(users[k], recipeId);
                    }
                    if (faker.number.int({ min: 0, max: 1 })) {
                    await addCommentToRecipe(users[k], recipeId);
                    }
                }
            }
        }
    }
  
    await markAsSeeded();
    console.log("Database seeded successfully.");
};

const initializeDatabase = async () => {
    await createAppMetadataTable();
  
    if (process.env.SEED_DATABASE === "true") {
        await seedDatabase();
    }
};
  
export default initializeDatabase;