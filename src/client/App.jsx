import { useEffect } from "react";
// createBrowserRouter: to create a router instance for setting up router configuration
import { createBrowserRouter } from "react-router-dom";
// RouterProvider: a componenet that provides router instance for routing and navigation
import { RouterProvider } from "react-router-dom";

import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
