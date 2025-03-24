import { ListGroup, ListGroupItem, Button } from "react-bootstrap"

function FriendRequests({ userRequests, acceptFriendRequest, rejectFriendRequest, setUserRequests }) {
    const handleAccept = (sender) => {
        acceptFriendRequest(sender);
        setUserRequests(prevRequests => prevRequests.filter(request => request.sender !== sender));
    };

    const handleReject = (sender) => {
        rejectFriendRequest(sender);
        setUserRequests(prevRequests => prevRequests.filter(request => request.sender !== sender));
    };

    return (
        <ListGroup>
            {userRequests.length > 0 && userRequests.map((request, index) => (
                <ListGroupItem key={index} className="m-2 p-1 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{request.sender}</strong>
                        <p className="mb-0 text-secondary"><small>Incoming Friend Request</small></p>
                    </div>
                    <div>
                        <Button className="mx-1" variant="outline-success" onClick={() => handleAccept(request.sender)}>
                            <i className="bi bi-check2 p-0"></i>
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleReject(request.sender)}>
                            <i className="bi bi-x p-0"></i>
                        </Button>
                    </div>
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default FriendRequests