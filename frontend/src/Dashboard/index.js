import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ajaxTest from '../Services/fetchService';
import StatusPill from '../StatusPill';
import { useUser } from '../UserProvider';



const Dashboard = () => {
    
  const user = useUser();
  const [assignments, setAssignments] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ajaxTest("api/assignments", "GET", user.jwt).then(
      (assignmentData) => {
      setAssignments(assignmentData);
    });
    if(!user.jwt){
      return navigate("/login");
    }
  }, [user.jwt]);

  function createAssignment() {
    ajaxTest("api/assignments", "POST", user.jwt).then(
      (assignment) => {
        navigate(`/assignments/${assignment.id}`);
        // window.location.href = `/assignments/${assignment.id}`
      });
    }

  return (
  <div style={{margin: '2em'}}>
    <Button onClick={() => createAssignment()}>Submit New Assignment</Button>
    <Row>
      <Col>
        <Button style={{cursor: "pointer"}} 
        onClick={() => {
          user.setJwt(null);
          navigate("/login");
        }}>
          Logout
        </Button>
      </Col>
    </Row>
      {assignments ? (
        <div
          className="d-grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}
        >
        {assignments.map((assignment) => (
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
              <Button onClick={() => 
                navigate(`/assignments/${assignment.id}`)
                // window.location.href = `/assignments/${assignment.id}`

                }>Edit</Button>
            </Card.Body>
          </Card>
      </div>))}
      </div>) : <></>}
  </div>

  )
};

export default Dashboard;