import { useEffect } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile, { userDataLoader } from './pages/Profile';
import AddRecipe from './pages/AddRecipe';
import RecipeDetails from './pages/RecipeDetails';
import MyRecipes from './pages/MyRecipes';

function App() {
  const isAuthed = async () => {
    try {
      const res = await fetch("/check", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      return data.isAuthed;
    } catch (error) {
      // Some error while checking auth...
      return false;
    }
  }

  const authLoader = async () => {
    const isLoggedIn = await isAuthed();
    if (!isLoggedIn) {
      return redirect("/login");
    }

    return null;
  }

  const logoutLoader = async () => {
    try {
      const res = await fetch("/user/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });
      await res.json();
      return redirect("/login");
    } catch (error) {
      return redirect("/login");
    }
  }

  const redirectLoader = (redirectRoute) => {
    return async () => {
      const isLoggedIn = await isAuthed();
      if (isLoggedIn) {
        return redirect(redirectRoute);
      }
      
      return null;
    }
  }

  async function recipeLoader ({ params }) {
    try {
      const res = await fetch(`/recipe/${params.recipeId}`, {
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("Recipe not found");
      }

      const { recipe } = await res.json();

      return {
        recipe,
        isAuthed: await isAuthed()
      };
    } catch (error) {
      return {
        recipe: null,
        isAuthed: await isAuthed(),
        error: error.message
      };
    }
  }

  const router = createBrowserRouter([
    {
      path: "/",
      loader: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const searchTerm = url.searchParams.get("search") || "";
          const res = await fetch(`/recipe?search=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();

          return {
            recipes: data.recipes,
            isAuthed: await isAuthed()
          };
        } catch (error) {
          console.error("Error loading recipes: ", error);
          return {
            recipes: [],
            isAuthed: await isAuthed()
          };
        }
      },
      element: <Home />
    },
    {
      path: "/login",
      loader: redirectLoader("/"),
      element: <Login />
    },
    {
      path: "/logout",
      loader: logoutLoader
    },
    {
      path: "/Signup",
      element: <Signup />
    },
    // Authenticated routes
    {
      path: "/profile",
      loader: userDataLoader,
      element: <Profile />
    },
    {
      path: "/my-recipes",
      loader: userDataLoader,
      element: <MyRecipes />
    },
    {
      path: "/add-recipe",
      loader: authLoader,
      element: <AddRecipe />
    },
    {
      path: "/recipes/:recipeId/view",
      element: <RecipeDetails />,
      // params refers to URL parameters e.g. :recipeId is a param
      loader: recipeLoader
    },
    {
      path: "/recipes/:recipeId/edit",
      element: <AddRecipe isEdit={true} />,
      // params refers to URL parameters e.g. :recipeId is a param
      loader: recipeLoader
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;