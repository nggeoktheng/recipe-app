import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Ingredients = ({ ingredients }) => {
    const pakNSaveSearch = "https://www.paknsave.co.nz/shop/search?q=";
    const ingredientsArr = ingredients.split(",").map(s => s.trim());
  
    console.log("Ingredients Arr: ", ingredientsArr);
    return (
        <>
            <h3>Ingredients</h3>
            <div>{ingredients}</div>
        </>
    )
};
  
const PreparationSteps = ({ steps }) => {
    const stepsArr = steps.split("\n").map(step => step.substring(step.indexOf(" ")).trim());

    return (
        <>
            <h3>Preparation Steps</h3>
            <ol className="list-decimal">
                {stepsArr.map((step, index) => (
                <li key={`step-${index}`}>{step}</li>
                ))}
            </ol>
        </>
    )
};

const Comments = ({ recipeId, isAuthed }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const fetchComments = async () => {
        const res = await fetch(`/recipe/${recipeId}/comments`);
        const data = await res.json();
        if (data.success) {
            setComments(data.comments);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const res = await fetch(`/recipe/${recipeId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: newComment }),
        });

        const data = await res.json();
        if (data.success) {
            setComments(prevComments => [{
                id: data.comment.id,
                comment: newComment,
                created_at: data.comment.created_at,
                username: "You"
            }, ...prevComments]);
            setNewComment("");
        }
    };

    return (
        <div className="mt-10 mb-10">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            {isAuthed && (
                <form onSubmit={handleSubmit} className="mb-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Add a comment..."
                />
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Post Comment
                </button>
                </form>
            )}
            <div>
                {comments.map((comment) => (
                <div key={comment.id} className="mb-2 p-2 bg-gray-100 rounded">
                    <p>{comment.comment}</p>
                    <p className="text-sm text-gray-600">
                    By {comment.username} on {new Date(comment.created_at).toLocaleString()}
                    </p>
                </div>
                ))}
            </div>
        </div>
    );
};

function RecipeDetails() {
    const { recipe, isAuthed } = useLoaderData();
    const [isStarred, setIsStarred] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
            <div className="container mx-auto">
                <article className="prose">
                    <h2>{recipe.title}</h2>

                    <button 
                        onClick={handleStarClick}
                        className={`px-4 py-2 rounded ${isStarred ? 'bg-yellow-400' : 'bg-gray-200'}`}
                        disabled={isLoading}
                    >
                        {isStarred ? '★ Starred' : '☆ Star'}
                    </button>

                    <img className="w-auto" src={recipe.image_url} alt={recipe.title} />

                    <Ingredients ingredients={recipe.ingredients} />

                    <PreparationSteps steps={recipe.steps} />
                </article>

                <Comments recipeId={recipe.id} isAuthed={isAuthed} />
            </div>
        </>
    )
}

export default RecipeDetails;