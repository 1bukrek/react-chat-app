import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// components & pages
import Chat from './pages/Chat.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import HeadNavbar from './components/navbar/HeadNavbar.js';

const router = createBrowserRouter([
  { path: '/', element: <Chat /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <HeadNavbar />
    <RouterProvider router={router} />
  </>
);
