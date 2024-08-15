import { useLoaderData } from "react-router-dom";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";

function RecipeDetails() {
    const data = useLoaderData();

    console.log("recipe details: ", data);
    return (
        <>
            {data.isAuthed ? <LoggedInHeader /> : <LoggedOutHeader />}
            Recipe details
        </>
    )
}

export default RecipeDetails;