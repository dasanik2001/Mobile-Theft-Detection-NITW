import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/homepage";
import Register from "./pages/register";
import Login from "./pages/login";
import Error from "./pages/error";
import Dashboard from "./pages/dashboard";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        errorElement :<Error/>,
    },
    {
        path: '/register',
        element: <Register/>,
        errorElement :<Error/>,
    },
    {
        path: '/login',
        element: <Login/>,
        errorElement :<Error/>,
    },
    {
        path: '/dashboard',
        element: <Dashboard/>,
        errorElement: <Error/>,
        
        protected: true
    }

])

