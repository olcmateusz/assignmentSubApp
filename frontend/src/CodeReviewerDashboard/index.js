import { useUser } from '../UserProvider';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ajaxTest from '../Services/fetchService';
import StatusPill from '../StatusPill';
import { useLocalState } from '../util/useLocalStorage';




const CodeReviewerDashboard = () => {
    const user = useUser();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState(null);
    
    useEffect(() => {
      ajaxTest("api/assignments", "GET", user.jwt).then(
        (assignmentData) => {
        setAssignments(assignmentData);
      });
    }, [user.jwt]);

    useEffect(() => {
        if(!user.jwt) navigate("/login");
    });

    function review(assignment){
        navigate(`/assignments/${assignment.id}`);
        // window.location.href = `/assignments/${assignment.id}`

        
    }

    function claimAssignment(assignment){

        // const decodedJwt = jwtDecode(user.jwt);
        // const decodedJwt = dec
        // const user = {
        //     username: decodedJwt.sub,
        // };


        assignment.codeReviewer = user;
        //TODO CHANGE HARDCODE
        assignment.status = "In review";
        ajaxTest(`api/assignments/${assignment.id}`, "PUT", user.jwt, assignment).then(updatedAssignment => {
            //TODO
            const assignmentsCopy = [ ...assignments];
            const i = assignmentsCopy.findIndex((a) => ajaxTest.id === assignment.id);
            assignmentsCopy[i] = updatedAssignment;
            setAssignments(assignmentsCopy);
        });
    }


    return (
    <Container>
      <Row>
        <Col>
          <Button style={{cursor: "pointer"}} 
          onClick={() => {
            user.setJwt(null);
            // navigate("/login");
          }}>
            Logout
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className='h1'>CodeReviewerDashboard</div>
        </Col>
      </Row>
      <div className='assignment-wrapper in review'>
        <div className='h3' style={{marginTop: "-1em", marginBottom: "1em"}}>In review</div>
        {assignments && assignments.filter(assignment => assignment.status === 'In review').length  > 0 ? (
            <div
                className="d-grid gap-5"
                style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}
            >
            {assignments.filter(assignment => assignment.status === 'In review').map((assignment) => (
            <div key={assignment.id}>
                <Card style={{ width: '18rem', height: '18rem' }}>
                <Card.Body>
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <StatusPill value={assignment.status}></StatusPill>
                    <Card.Text>
                    <p>Grihub URL: {assignment.githubUrl}</p>
                    <p>Branch: {assignment.branch}</p>
                    </Card.Text>
                    {/* <Card.Link href="#"><Button>Edit</Button></Card.Link> */}
                    <Button onClick={() => review(assignment)}>Review</Button>
                </Card.Body>
                </Card>
            </div>))}
            </div>) : <div>No assignments found</div>}
      </div>
      <div className='assignment-wrapper submitted'>
        <div className='h3' style={{marginTop: "-1em", marginBottom: "1em"}}>Awaiting review</div>
        {assignments && assignments.filter(assignment => assignment.status === 'Submitted' || assignment.status === 'Resubmitted').length  > 0 ? (
            <div
                className="d-grid gap-5"
                style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}
            >
            {assignments.filter(assignment => (assignment.status === 'Submitted' || assignment.status === 'Resubmitted') )
            .sort((a, b) => {
                if (a.status === "Resubmitted"){
                    return -1;
                }else return 1;
            })
            .map((assignment) => (
            <div key={assignment.id}>
                <Card style={{ width: '18rem', height: '18rem' }}>
                <Card.Body>
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <StatusPill value={assignment.status}></StatusPill>
                    <Card.Text>
                    <p>Grihub URL: {assignment.githubUrl}</p>
                    <p>Branch: {assignment.branch}</p>
                    </Card.Text>
                    {/* <Card.Link href="#"><Button>Edit</Button></Card.Link> */}
                    <Button onClick={() => claimAssignment(assignment)}>Claim</Button>
                </Card.Body>
                </Card>
            </div>))}
            </div>) : <div>No assignments found</div>}
      </div>
    
      <div className='assignment-wrapper submitted'>
        <div className='h3' style={{marginTop: "-1em", marginBottom: "1em"}}>Needs update</div>
        {assignments && assignments.filter(assignment => assignment.status === 'Needs update').length > 0 ? (
            <div
                className="d-grid gap-5"
                style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}
            >
            {assignments.filter(assignment => assignment.status === 'Needs update').map((assignment) => (
            <div key={assignment.id}>
                <Card style={{ width: '18rem', height: '18rem' }}>
                <Card.Body>
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <StatusPill value={assignment.status}></StatusPill>
                    <Card.Text>
                    <p>Grihub URL: {assignment.githubUrl}</p>
                    <p>Branch: {assignment.branch}</p>
                    </Card.Text>
                    {/* <Card.Link href="#"><Button>Edit</Button></Card.Link> */}
                    <Button onClick={() => {
                        navigate(`/assignments/${assignment.id}`);
                        // window.location.href = `/assignments/${assignment.id}`
                        }}>Inspect</Button>
                </Card.Body>
                </Card>
            </div>))}
            </div>) : <div>No assignments found</div>}
      </div>

    </Container>

    );
};

export default CodeReviewerDashboard;