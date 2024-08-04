import { useEffect } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

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
      element: <Login />
    },
    {
      path: "/Signup",
      element: <Signup />
    },
    {
      path: "/profile",
      loader: authLoader,
      element: <Profile />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
