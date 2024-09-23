import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import LoggedOutHeader from "../components/LoggedOutHeader";
import LoggedInHeader from "../components/LoggedInHeader";
import FavoriteRecipes from "../components/FavoriteRecipes";
import RecipeCard from "../components/RecipeCard";

function Home() {
    const { recipes: initialRecipes, isAuthed } = useLoaderData();
    const [recipes, setRecipes] = useState(initialRecipes);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const search = searchParams.get('search') || '';
        setSearchTerm(search);
        if (search) {
            performSearch(search);
        }
    }, []);

    const performSearch = async (term) => {
        try {
            const response = await fetch(`/recipe?search=${encodeURIComponent(term)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }
            const data = await response.json();
            setRecipes(data.recipes);
        } catch (error) {
            console.error("Error searching recipes: ", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ search: searchTerm });
        performSearch(searchTerm);
    };

    return (
        <>
            {isAuthed ? <LoggedInHeader /> : <LoggedOutHeader />}
            {isAuthed ? (
                <div className="container mx-auto px-4 py-8">
                    <FavoriteRecipes />
                </div>) 
                : null
            }
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Latest Recipes</h1>
                <form onSubmit={handleSearch} className="mb-8">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search recipes..."
                        className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home;