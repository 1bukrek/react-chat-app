import { useEffect, useState } from "react"
import { InputGroup, ListGroup, Nav, Form, Button, ListGroupItem } from "react-bootstrap"
import FriendRequests from "../components/sidebar/FriendRequests.js"

import "../styles/Chat.css"

import { io } from "socket.io-client"

const socket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:3001", {
    withCredentials: true,
});

function Chat() {
    const token = sessionStorage.getItem("token")
    if (!token) window.location.href = "/login"

    const [userFriends, setUserFriends] = useState([])
    const [userRequests, setUserRequests] = useState([])
    const [friendName, setFriendName] = useState("")
    const [activeTab, setActiveTab] = useState(1)

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])

    useEffect(() => {
        // requesting current friends, requests from server
        // when the component is rendered
        socket.emit("request-friends-list", sessionStorage.getItem("username"))
        socket.emit("request-requests-list", sessionStorage.getItem("username"))
        // tracking user friends
        socket.on("response-friends-list", function ({ status, friends }) {
            if (!status) return console.log("Error occured while tracking user friends.")
            setUserFriends(friends)
        })
        // tracking user requests
        socket.on("response-requests-list", function ({ status, requests }) {
            if (!status) return console.log("Error occured while tracking user requests.")
            setUserRequests(requests)
        })

        socket.on("create-message", (data) => {
            setMessages(messages => [...messages, data]);
        });

        return () => {
            socket.off("create-message");
        };
    }, [])

    function sendFriendRequest() {
        if (friendName === sessionStorage.getItem("username")) return console.log("You can't send friend request yourself.")
        if (friendName) {
            socket.emit("send-friend-request", {
                sender_username: sessionStorage.getItem("username"),
                receiver_username: friendName
            })
            setFriendName("")
        }
    }

    function acceptFriendRequest(username) {
        console.log(username)
        socket.emit("accept-friend-request", { receiver: sessionStorage.getItem("username"), sender: username })
    }

    function rejectFriendRequest(username) {
        socket.emit("reject-friend-request", { receiver: sessionStorage.getItem("username"), sender: username })
    }

    function createMessage() {
        if (!message) return;
        socket.emit("create-message", { username: sessionStorage.getItem("username"), content: message })
        setMessage("")
    }

    return (
        <div className="chat">
            <div className="sidebar">
                <Nav fill variant="tabs" defaultActiveKey="1" onSelect={(eventKey) => setActiveTab(Number(eventKey))}>
                    <Nav.Item>
                        <Nav.Link eventKey="1">Friends</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">Requests</Nav.Link>
                    </Nav.Item>
                </Nav>

                {activeTab === 1 && (
                    <div>
                        <div className="friends-list">
                            <ListGroup>
                                {userFriends.length > 0 && userFriends.map((friend, index) => (
                                    <ListGroupItem key={index}>{friend.username}</ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>

                        <div className="friend-request-form">
                            <InputGroup>
                                <Form.Control
                                    value={friendName}
                                    onChange={(e) => setFriendName(e.target.value)}
                                    placeholder="Send friend request"
                                    required
                                />
                                <Button variant="dark" onClick={sendFriendRequest}>Send</Button>
                            </InputGroup>
                        </div>
                    </div>
                )}

                {activeTab === 2 && (
                    <>
                        <FriendRequests userRequests={userRequests} acceptFriendRequest={acceptFriendRequest} rejectFriendRequest={rejectFriendRequest} setUserRequests={setUserRequests} />
                    </>
                )}
            </div>

            <div className="chat-content">
                <div className="chat-messages">
                    <ListGroup className="rounded-0">
                        {messages.map(message => (
                            <ListGroupItem>
                                <p className="mb-0 text-secondary fw-bold"><small>u/{message.username}</small></p>
                                <p className="mb-0">{message.content}</p>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            </div>

            <div className="chat-input">
                <InputGroup>
                    <Form.Control required value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-0" placeholder="Type a message..." />
                    <Button type="submit" variant="success" onClick={createMessage}>Send</Button>
                </InputGroup>
            </div>

        </div>
    )
}

export default Chat
