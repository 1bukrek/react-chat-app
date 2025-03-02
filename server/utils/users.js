import database from "../database/database.js"

function get_user_by_username(username) {
    const query = `
        SELECT * FROM users
        WHERE users.username = ?
    `

    return new Promise((resolve, reject) => {
        database.get(query, [username], (err, row) => {
            if (err) {
                reject(err) // Reject the promise with the error if there's an issue
            }

            if (!row) return null

            resolve(row)
        })
    })
}

function update_friend_request_list(username, friend) {
    database.get(
        "SELECT friend_requests FROM users WHERE username = ?",
        [friend],
        (err, row) => {
            if (err) {
                console.error("ERROR FETCHING USER")
                return
            }

            if (username == friend) return

            if (!row) {
                console.error("USER NOT FOUND")
                return
            }

            let current_friend_requests = row.friend_requests
            let friend_requests_array = current_friend_requests
                ? current_friend_requests.split(",")
                : []

            if (friend_requests_array.includes(friend)) {
                console.error("FRIEND REQUEST ALREADY SENT")
                return
            }

            friend_requests_array.push(friend)
            const new_friend_requests_list = friend_requests_array.join(",")

            // Update the user's friend request list in the database
            database.run(
                "UPDATE users SET friend_requests = ? WHERE username = ?",
                [new_friend_requests_list, username],
                (err) => {
                    if (err) {
                        console.error(
                            "ERROR UPDATING FRIEND REQUEST LIST:",
                            err.message
                        )
                        return
                    }
                }
            )
        }
    )
}

function accept_friend_request(sender, receiver, callback) {
    database.serialize(() => {
        database.run(`UPDATE friend_requests SET status = 'accepted' WHERE sender_username = ? AND receiver_username = ?`,
            [sender, receiver],
            function (err) {
                if (err) return callback(err);
                database.run(`INSERT INTO friends (user1_username, user2_username) VALUES (?, ?)`,
                    [sender, receiver],
                    function (err) {
                        callback(err);
                    }
                );
            }
        );
    });
}

function reject_friend_request(sender, receiver, callback) {
    database.run(`UPDATE friend_requests SET status = 'rejected' WHERE sender_username = ? AND receiver_username = ?`,
        [sender, receiver],
        function (err) {
            callback(err);
        }
    );
}

function get_friends(username, callback) {
    database.all(`SELECT user1_username, user2_username FROM friends WHERE user1_username = ? OR user2_username = ?`,
        [username, username],
        function (err, rows) {
            if (err) return callback(err);
            const friends = rows.map(row => row.user1_username === username ? row.user2_username : row.user1_username);
            callback(null, friends);
        }
    );
}

export {
    get_user_by_username,
    update_friend_request_list,
    accept_friend_request,
    reject_friend_request
}