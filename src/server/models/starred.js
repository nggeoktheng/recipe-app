import sql from "../database.js";

export const getStarredRecipes = async (userId) => {
    try {
        // Get all recipes that the user has starred
        // Join the starred table with the recipes table on the recipe_id column
        // Order the results by the starred.created_at column in descending order
        // Return the results as an array

        const starredRecipes = await sql`
            SELECT recipes.id, recipes.user_id, recipes.image_url, recipes.title, recipes.ingredients, recipes.steps, 
            users.username 
            FROM recipes
            JOIN users ON public.users.id = public.recipes.user_id
            JOIN starred ON starred.recipe_id = recipes.id
            WHERE starred.user_id = ${userId}
            ORDER BY starred.created_at DESC
        `;

        return starredRecipes;
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    }
}