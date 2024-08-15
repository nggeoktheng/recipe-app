import { useLoaderData } from "react-router-dom";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";

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
}
  
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
}

const Comments = (recipeId) => {
    return (
        <>
            comments
        </>
    )
}

function RecipeDetails() {
    const { recipe, isAuthed } = useLoaderData();

    console.log("recipe details: ", {
        recipe,
        isAuthed
    });
    return (
        <>
            {isAuthed ? <LoggedInHeader /> : <LoggedOutHeader />}
            <div className="container mx-auto">
                <article className="prose">
                    <h2>{recipe.title}</h2>

                    <img className=" w-auto" src={recipe.image_url} />

                    <Ingredients ingredients={recipe.ingredients} />

                    <PreparationSteps steps={recipe.steps} />
                </article>

                <Comments />
            </div>
        </>
    )
}

export default RecipeDetails;