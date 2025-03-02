import React from 'react'

import { Nav, Container, Navbar } from 'react-bootstrap'

const ChatNavbar = () => {
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">Convochat</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default ChatNavbar