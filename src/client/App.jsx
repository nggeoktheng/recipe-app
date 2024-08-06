import { useEffect } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AddRecipe from './pages/AddRecipe';

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

  const profileLoader = async () => {
    const isLoggedIn = await isAuthed();
    if (isLoggedIn) {
      return redirect("/profile");
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

  useEffect(() => {
    async function fetchAPI() {
      const res = await fetch("/hello");
      const data = await res.json();

      console.log("has data: ", data);
    }

    fetchAPI();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/login",
      loader: profileLoader,
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
      loader: authLoader,
      element: <Profile />
    },
    {
      path: "/add-recipe",
      loader: authLoader,
      element: <AddRecipe />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
