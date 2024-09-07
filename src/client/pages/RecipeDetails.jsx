import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import IngredientsList from "../components/IngredientsList";
import Comments from "../components/Comments";
import PreparationSteps from "../components/PreparationSteps";  

function RecipeDetails() {
    const { recipe, isAuthed } = useLoaderData();
    const [isStarred, setIsStarred] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!recipe) {
            setError("Recipe not found");
            setIsLoading(false);
            return;
        }

        if (isAuthed) {
            checkStarredStatus();
        } else {
            setIsLoading(false);
        }
    }, [isAuthed, recipe]);

    const checkStarredStatus = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/recipe/${recipe.id}/star`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Failed to fetch starred status");
            }
            const data = await response.json();
            setIsStarred(data.isStarred);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStarClick = async () => {
        if (!isAuthed) {
            alert("Please log in to star recipes.");
            return;
        }

        try {
            setIsLoading(true);
            const method = isStarred ? "DELETE" : "POST";
            const response = await fetch(`/recipe/${recipe.id}/star`, {
                method,
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to update star status");
            }
            setIsStarred(!isStarred);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!recipe) {
        return <ErrorMessage message="Recipe not found" />;
    }

    return (
        <>
            {isAuthed ? <LoggedInHeader /> : <LoggedOutHeader />}
            <div className="container mx-auto px-4 py-8">
                <article className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img className="w-full h-64 object-cover" src={recipe.image_url} alt={recipe.title} />
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-bold text-gray-800">{recipe.title}</h2>
                            <button 
                                onClick={handleStarClick}
                                className={`px-4 py-2 rounded-full ${isStarred ? 'bg-yellow-400 text-gray-800' : 'bg-gray-200 text-gray-600'} hover:bg-yellow-300 transition duration-300`}
                                disabled={isLoading}
                            >
                                {isStarred ? '★ Starred' : '☆ Star'}
                            </button>
                        </div>
                        <IngredientsList ingredients={recipe.ingredients} />
                        <PreparationSteps steps={recipe.steps} />
                    </div>
                </article>
                <Comments recipeId={recipe.id} isAuthed={isAuthed} />
            </div>
        </>
    )
}

export default RecipeDetails;