import React, { useState } from 'react'

import { Alert, Button, Card, Container, Form } from 'react-bootstrap'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverMessage, setServerMessage] = useState("")

    const [validated, setValidated] = useState(false);

    async function login() {
        if (!username || !password) return console.log("Username and password are required.");

        const res = await fetch('https://react-chat-app-g048.onrender.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const { success, message, token, user } = await res.json();

        // set jsonwebtoken to session storage
        if (token) sessionStorage.setItem('token', token)
        // redirect to home page
        if (success) {
            window.location.href = '/';
            // set user id to session storage 
            sessionStorage.setItem('user_id', user.id)
            sessionStorage.setItem('username', user.username)
        }
        // error message from server
        else setServerMessage(message)
    };

    function controlValidation(event) {
        event.preventDefault()

        const form = event.currentTarget;
        if (form.checkValidity() === false) event.stopPropagation();

        setValidated(true);
    }

    return (
        <div>
            <Container className='w-25' style={{ marginTop: "10rem" }}>
                <p className='display-5 fw-bold'>Login</p>
                <Card className='p-3'>
                    <Form noValidate validated={validated} onSubmit={controlValidation}>
                        <Form.Group controlId='validationCustom01'>
                            <Form.Label htmlFor="inputUsername">Username</Form.Label>
                            <Form.Control
                                type="text"
                                aria-describedby="usernameHelpBlock"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>Please provide a proper username.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId='validationCustom01'>
                            <Form.Label className='mt-3' htmlFor="inputPassword">Password</Form.Label>
                            <Form.Control
                                type="password"
                                aria-describedby="passwordHelpBlock"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>Please provide a proper password.</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant='dark' className='w-100 mt-3' type='submit' onClick={login}>
                            Login
                        </Button>
                        <div className='text-center mt-3'>
                            <a className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href="/register">
                                I don't have an account.
                            </a>
                        </div>
                        {serverMessage && <Alert variant='danger' className='mb-0 mt-3'><i class="bi bi-exclamation-triangle-fill"></i> {serverMessage}</Alert>}
                    </Form>
                </Card>
            </Container >
        </div >
    )
}

export default Login