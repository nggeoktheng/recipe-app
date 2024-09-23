import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

const FavoriteRecipes = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Fetch favorite recipes from the server
        // Update the favorites state with the fetched data
        // Render the favorites
        const fetchFavorites = async () => {
            try {
                const response = await fetch('/starred/starred');
                if (!response.ok) {
                    throw new Error("Failed to fetch favorites");
                }
                const data = await response.json();
                console.log("Fetched favorites: ", data);
                setFavorites(data);
            } catch (error) {
                console.error("Error fetching favorites: ", error);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold mb-8">Favorite Recipes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            </div>
        </>
    );
}

export default FavoriteRecipes;