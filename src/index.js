import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// components & pages
import Chat from './pages/Chat.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ChatNavbar from './components/navbar/Navbar.js';

const router = createBrowserRouter([
  { path: '/', element: <Chat /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ChatNavbar />
    <RouterProvider router={router} />
  </>
);
