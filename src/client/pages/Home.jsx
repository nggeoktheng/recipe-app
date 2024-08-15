import { useLoaderData } from "react-router-dom";
import LoggedOutHeader from "../components/LoggedOutHeader";
import LoggedInHeader from "../components/LoggedInHeader";

function Home() {
    const {recipes, isAuthed} = useLoaderData();

    console.log("My recipes ", {recipes, isAuthed});
    return (
        <>
            {isAuthed ? <LoggedInHeader /> : <LoggedOutHeader />}
            Home Page
        </>
    )
}

export default Home;