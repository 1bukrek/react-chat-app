import express from "express"
import http from "http"
import { Server } from "socket.io"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import database from "./database/database.js"
import { get_user_by_username, accept_friend_request, reject_friend_request } from "./utils/users.js"
import { create_message } from "./utils/message.js"

import path from "path";

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://react-chat-app-g048.onrender.com",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(express.json())
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return;

    database.get(
        "SELECT * FROM users WHERE users.username = ?", [username], (err, row) => {
            if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
            if (row) return res.json({ success: false, message: "This username is already taken, choose another one." })
            // hash the password
            const hashedPassword = bcrypt.hashSync(password, 8)
            // insert the new user into the database
            database.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
                if (err) return res.json({ success: false, message: "Failed to register user.", })
                res.json({ success: true, message: "User registered successfully.", })
            })
        }
    )

});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.json({ success: false, message: "Username and password are required." })

    // find the user in the database by username
    database.get(
        "SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
            if (!row) return res.json({ success: false, message: "Invalid username or password." })

            // compare the provided password with the hashed password from the database
            const password_match = bcrypt.compareSync(password, row.password)

            if (password_match) {
                // create jsonwebtoken for one hour after successful login
                const token = jwt.sign({ id: row.id, username: row.username }, "secretkey", { expiresIn: "1h" })
                // send the token to the client
                return res.json({ success: true, message: "User logged in successfully.", token: token, user: row })
            } else {
                // if the passwords do not match
                return res.json({ success: false, message: "Invalid username or password." })
            }
        }
    )
})

io.on("connection", (socket) => {
    socket.on("request-friends-list", function (username) {
        database.all("SELECT u.username, u.username FROM friends f JOIN users u ON (u.username = f.user1_username OR u.username = f.user2_username) WHERE ? IN (f.user1_username, f.user2_username)",
            [username],
            (err, rows) => {
                if (err) return socket.emit("response-friends-list", { status: false, friends: [] })
                else return socket.emit("response-friends-list", { status: true, friends: rows })
            }
        )
    })

    socket.on("request-requests-list", function (username) {
        database.all("SELECT friend_requests.id, users.username AS sender FROM friend_requests JOIN users ON friend_requests.sender_username = users.username WHERE friend_requests.receiver_username = ? AND friend_requests.status = 'pending'",
            [username], (err, rows) => {
                if (err) return console.log(err.message)
                else return socket.emit("response-requests-list", { status: true, requests: rows })
            }
        );
    })

    socket.on("send-friend-request", async function ({ sender_username, receiver_username }) {
        if (sender_username == receiver_username) return;
        await get_user_by_username(receiver_username).then(data => {
            if (data) database.run("INSERT INTO friend_requests (sender_username, receiver_username) VALUES(?, ?)", [sender_username, receiver_username])
        })
    })

    socket.on("accept-friend-request", function ({ receiver, sender }) {
        accept_friend_request(sender, receiver, function (err) {
            if (err) return console.log(err)
        })
    })

    socket.on("reject-friend-request", function ({ receiver, sender }) {
        reject_friend_request(sender, receiver, function (err) {
            if (err) return console.log(err)
        })
    })

    socket.on("create-message", function ({ username, content }) {
        create_message(username, content)
        io.emit("create-message", { username, content })
    })
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.warn("SERVER IS RUNNING ON: 3001 PORT")
})