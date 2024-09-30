import { useLoaderData, useNavigate } from "react-router-dom";
import LoggedInHeader from "../components/LoggedInHeader";
import { Avatar } from "@files-ui/react";
import defaultAvatarImg from "../assets/default.png";
import ProfileForm from "../components/ProfileForm";
import { useState, useEffect } from "react";
import { RecipeCard } from "../components/RecipeCard";

function MyRecipes() {
    const [user, setUser] = useState(useLoaderData());
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleProfileUpdate = async (updatedProfile) => {
        try {
            const response = await fetch("/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProfile),
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to update profile");
            const data = await response.json();
            navigate(0); // Refresh the page to show updated data
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const response = await fetch("/user/avatar", {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to upload avatar");
            const updatedUser = await response.json();
            setUser(prevUser => ({ ...prevUser, ...updatedUser }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        // Confirm deletion
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            const response = await fetch(`/recipe/${recipeId}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to delete recipe");
            setUser(prevUser => ({ ...prevUser, recipes: prevUser.recipes.filter(recipe => recipe.id !== recipeId) }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditRecipe = async (recipeId) => {
        navigate(`/recipes/${recipeId}/edit`);
    }

    if (!user) return <div>Error: Failed to load user data</div>;

    return (
        <>
            <LoggedInHeader userImg={user.profile_img} firstName={user.first_name } />
            <div className="container mx-auto px-4 py-8">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">My Recipes</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.recipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} canEdit onDelete={handleDeleteRecipe} onEdit={handleEditRecipe}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyRecipes;