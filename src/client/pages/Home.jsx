import { useLoaderData } from "react-router-dom";
import LoggedOutHeader from "../components/LoggedOutHeader";

function Home() {
    const recipes = useLoaderData();

    console.log("My recipes ", recipes);
    return (
        <>
            <LoggedOutHeader />
            Home Page
        </>
    )
}

export default Home;