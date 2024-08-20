import sql from "../database.js";

export const getRecipes = async (searchTerm = "") => {
    try {
        const recipes = await sql`
            SELECT recipes.id, recipes.user_id, recipes.image_url, recipes.title, users.username FROM recipes
            JOIN users ON public.users.id = public.recipes.user_id
            WHERE LOWER(recipes.title) LIKE LOWER(${`%${searchTerm}%`})
            ORDER BY recipes.created_date DESC
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
                sql({
                    ...recipe,
                    ingredients: JSON.stringify(recipe.ingredients)
                })
            }
            RETURNING id
        `;
        return addRecipe[0].id;
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}

export const addComment = async (userId, recipeId, comment) => {
    try {
        const result = await sql`
            INSERT INTO comments (user_id, recipe_id, comment)
            VALUES (${userId}, ${recipeId}, ${comment})
            RETURNING id, created_at
        `;
        return result[0];
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}

export const getComments = async (recipeId) => {
    try {
        const comments = await sql`
            SELECT comments.id, comments.comment, comments.created_at, users.username
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.recipe_id = ${recipeId}
            ORDER BY comments.created_at DESC
        `;
        return comments;
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}

export const addStar = async (userId, recipeId) => {
    try {
        // Use ON CONFLICT ON CONSTRAINT unique_user_recipe to 
        // handle the case where a user tries to star a recipe they've already starred.
        await sql`
            INSERT INTO starred (user_id, recipe_id)
            VALUES (${userId}, ${recipeId})
            ON CONFLICT ON CONSTRAINT unique_user_recipe
            DO NOTHING
        `;
        return { success: true };
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}

export const removeStar = async (userId, recipeId) => {
    try {
        await sql`
            DELETE FROM starred
            WHERE user_id = ${userId} AND recipe_id = ${recipeId}
        `;
        return { success: true };
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}

export const isStarred = async (userId, recipeId) => {
    try {
        // SELECT EXISTS returns true or false
        // use SELECT 1 to see if the row exists
        const result = await sql`
            SELECT EXISTS (
            SELECT 1 FROM starred
            WHERE user_id = ${userId} AND recipe_id = ${recipeId}
            ) as is_starred
        `;
        return result[0].is_starred;
    } catch (error) {
        console.log("Database Error: ", error);
        throw error;
    }
}