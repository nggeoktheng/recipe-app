import sql from "../database.js";

export const getRecipes = async () => {
    try {
        const recipes = await sql`
            SELECT recipes.id, recipes.user_id, recipes.image_url, recipes.title, users.username FROM recipes
            JOIN users ON public.users.id = public.recipes.user_id
        `;

        return recipes;
    } catch (error) {
        console.log("DB Error: ", error.message);
    }
}

export const getRecipeById = async (recipeId) => {
    try {
        const recipes = await sql`
            SELECT recipes.id, recipes.user_id, recipes.image_url, recipes.title, recipes.ingredients, recipes.steps, 
            users.username 
            FROM recipes
            JOIN users ON public.users.id = public.recipes.user_id
            WHERE recipes.id = ${recipeId}
        `;

        return recipes[0];
    } catch (error) {
        console.log("DB Error: ", error.message);
    }
}

export const addRecipe = async (recipe) => {
    try {
        const addRecipe = await sql`
            INSERT INTO recipes ${
                sql(recipe)
            }
            RETURNING id
        `;
        return addRecipe[0].id;
    } catch (error) {
        console.log("Database Error: ", error);
    }
}
