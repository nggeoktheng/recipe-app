import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{recipe.title}</h3>
                <p className="text-gray-700 text-base">By {recipe.username}</p>
                <Link to={`/recipes/${recipe.id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    View Recipe
                </Link>
            </div>
        </div>
    );
}