import { FileInputButton, FileMosaic } from "@files-ui/react";
import LoggedInHeader from "../components/LoggedInHeader";
import styles from './addRecipe.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddRecipe() {
    const navigate = useNavigate();
    const [recipeImg, setRecipeImg] = useState(null);
    const createRecipe = async (e) => {
        e.preventDefault();
        const formElements = e.target.elements;

        const recipeForm = new FormData();
        recipeForm.append("image", recipeImg);
        recipeForm.append("title", formElements.title.value);
        recipeForm.append("ingredients", formElements.ingredients.value);
        recipeForm.append("steps", formElements.steps.value);
        recipeForm.append("cooking_time", formElements.cooking_time.value);

        try {
            const res = await fetch("/recipe", {
                method: "POST",
                credentials: "include",
                body: recipeForm
            });

            const data = await res.json();
            console.log("Got data ", data);
            if (data.success) {
                // Succeeded
                navigate(`/recipes/${data.recipeId}`);
            }
        } catch (error) {
            console.log("Got error: ", error);
        }
    }

    const updateFiles = (e) => {
        console.log("Update files with ", e);
        setRecipeImg(e.target.files[0]);
    }

    const removeFile = () => {
        setRecipeImg(null);
    }

    return (
        <>
            <LoggedInHeader />
            <div className="container mx-auto mt-5">
                <div className="border-b border-gray-900/10 pb-12">

                    <form onSubmit={createRecipe}>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Create Recipe</h2>

                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Recipe Name</label>
                            <div className="mt-2">
                                <input id="title" name="title" type="text" 
                                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="ingredients" className="block text-sm font-medium leading-6 text-gray-900">Ingredients</label>
                            <div className="mt-2">
                                <textarea id="ingredients" name="ingredients" rows="3" className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                            <div className="mt-3 text-sm leading-6 text-gray-600 inline">Format: <pre><code>1 Onion, 2lb Chicken breast</code></pre></div>
                        </div>

                        <div className="col-span-full mt-3">
                            <label htmlFor="steps" className="block text-sm font-medium leading-6 text-gray-900">Preparation Steps</label>
                            <div className="mt-2">
                                <textarea id="steps" 
                                    name="steps" 
                                    rows="3" 
                                    placeholder="1. Cut onions into dices.&#10;2. Score the chicken breast."
                                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="cooking_time" className="block text-sm font-medium leading-6 text-gray-900">Cooking Time</label>
                            <div className="mt-2">
                                <input id="cooking_time" name="cooking_time" type="text" 
                                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            <div className="mt-3 text-sm leading-6 text-gray-600 inline">Format: <pre><code>1h, 30m, 1:25</code></pre></div>
                        </div>

                        <div className="col-span-full mt-4">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Recipe Photo</label>
                            <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs" onChange={updateFiles} />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary mt-5">Create Recipe</button>
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

export default AddRecipe;