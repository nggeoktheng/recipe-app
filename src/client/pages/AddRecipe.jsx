import { FileInputButton, FileMosaic } from "@files-ui/react";
import LoggedInHeader from "../components/LoggedInHeader";
import styles from './addRecipe.module.css';
import { useState } from "react";

function AddRecipe() {
    const [recipeImg, setRecipeImg] = useState(null);
    const createRecipe = async (e) => {
        e.preventDefault();
        const formElements = e.target.elements;

        const recipeForm = new FormData();
        recipeForm.append("image", recipeImg.file);
        recipeForm.append("title", formElements.title.value);
        recipeForm.append("ingredients", formElements.ingredients.value);
        recipeForm.append("steps", formElements.steps.value);
        recipeForm.append("cooking_time", formElements.cooking_time.value);

        console.log("Submitted ", {
            form: recipeForm
        });

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
            }
        } catch (error) {
            console.log("Got error: ", error);
        }
    }

    const updateFiles = (data) => {
        console.log("Update files with ", data);
        setRecipeImg(data[0]);
    }

    const removeFile = () => {
        setRecipeImg(null);
    }

    return (
        <>
            <LoggedInHeader />
            Add recipe page
            <form className={styles.recipe} onSubmit={createRecipe}>
                <input type="text" name="title" id="title" placeholder="Title" />
                <textarea name="ingredients" id="ingredients" cols="30" rows="10" placeholder="1 onion, 1/2 pepper, 1lb ground beef, etc.."></textarea>
                <textarea name="steps" id="steps" cols="30" rows="10" placeholder="Steps..."></textarea>
                <input type="text" name="cooking_time" id="cooking_time" placeholder="1 hr, 1:25, 30m, etc." />
                {recipeImg ? (
                    <FileMosaic {...recipeImg} onDelete={removeFile} preview smartImgFit />
                ) : (
                    <FileInputButton value={recipeImg ? [recipeImg] : []} onChange={updateFiles} />
                )}
                <button type="submit">Create Recipe</button>
            </form>
        </>
    )
}

export default AddRecipe;