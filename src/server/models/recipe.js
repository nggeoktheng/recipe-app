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

export const addRecipe = async (recipe) => {
    try {
        const addRecipe = await sql`INSERT INTO recipes ${sql(recipe)}`;
        return addRecipe.count > 0;
    } catch (error) {
        console.log("Database Error: ", error);
    }
}
