import React, { useState } from 'react'
import { Button, Card, Container, Form, FormGroup } from 'react-bootstrap'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [validated, setValidated] = useState(false);

    async function register() {
        if (!username || !password) return console.log("Username and password are required.")
        const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";
        const res = await fetch(`${SERVER_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        let { success, message } = await res.json();
        if (success) window.location.href = '/login';
        else console.log(message)
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
                <p className='display-5 fw-bold'>Register</p>
                <Card className='p-3'>
                    <Form noValidate validated={validated} onSubmit={controlValidation}>
                        <Form.Group controlId='validationCustom01'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                aria-describedby="usernameHelpBlock"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>Please provide a proper username.</Form.Control.Feedback>
                        </Form.Group>
                        <FormGroup controlId='validationCustom02'>
                            <Form.Label className='mt-3'>Password</Form.Label>
                            <Form.Control
                                type="password"
                                aria-describedby="passwordHelpBlock"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>Please provide a proper password.</Form.Control.Feedback>
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className='mt-3 mb-0'>Your password must be 8-20 characters long, contain letters and numbers,
                                    and must not contain spaces, special characters, or emoji.</p>
                            </Form.Text>
                        </FormGroup>
                        <br></br>
                        <Button variant='dark' className='w-100 mt-0' type='submit' onClick={register}>
                            Login
                        </Button>
                    </Form>
                </Card>
            </Container>
        </div>
    )
}

export default Register