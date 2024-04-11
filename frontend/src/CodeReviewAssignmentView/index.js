import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import ajaxTest from '../Services/fetchService';
import StatusPill from '../StatusPill';
import { useLocalState } from '../util/useLocalStorage';
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from '../UserProvider';


const CodeReviewAssignmentView = () => {
    const navigate = useNavigate();
    const user = useUser();
    // const [jwt, setJwt] = useLocalState("", "jwt");
    const assignmentId = window.location.href.split("/assignments/")[1];
    const [assignment, setAssignment] = useState({
      branch: "",
      githubUrl: "",
      number: null,
      status: null,
    });
    
    const [assignmentEnums, setAssignmentEnums] = useState([]);
    const [assignmentStatuses, setAssignmentStatuses] = useState([]);

    const prevAssignmentValue = useRef(assignment);

    function updateAssignment(prop, value) {
      const newAssignment = { ...assignment };
      newAssignment[prop] = value;
      setAssignment(newAssignment);
    }
  
    function save(status) {
        if(status && assignment.status !== status){
            updateAssignment("status", status);
        }
      else{
        persist()
      }
  }

  function persist() {
    ajaxTest(`/api/assignments/${assignmentId}`, "PUT", user.jwt, assignment).then(
      (assignmentData) => {
        setAssignment(assignmentData);
    });
  }
    
  useEffect(() => {
    if(prevAssignmentValue.current.status !== assignment.status){
      persist();
    }
    prevAssignmentValue.current = assignment;
  },[assignment])


  useEffect(() => {
    ajaxTest(`/api/assignments/${assignmentId}`, "GET", user.jwt).then((assignmentResponse) => {
      let assignmentData=assignmentResponse.assignment
      setAssignment(assignmentData);
      setAssignmentEnums(assignmentResponse.assignmentEnum);
      setAssignmentStatuses(assignmentResponse.statusEnums);
      });
  }, []);
  
return (
    <Container className='mt-5'>
      <Row className='align-items-center'>
        <Col>
          {assignment.number ? <h1>Assignment {assignment.number}</h1> : <></>}
       </Col> 
       <Col>
        <StatusPill value={assignment.status}></StatusPill>
       </Col>
      </Row>
        {assignment ? (
        <>
            <Form.Group as={Row} className="my-3" controlId="githubUrl">
              <Form.Label column sm="2">
                GitHub URL:
              </Form.Label>
              <Col sm="10" md="8" lg="6">
                <Form.Control 
                readOnly="true"
                type="url" 
                placeholder='https://github.com/YourUsername/RepositoryName' 
                onChange={(e) => updateAssignment("githubUrl", e.target.value)} 
                value={assignment.githubUrl} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="branch">
              <Form.Label column sm="2">
                Branch:
              </Form.Label>
              <Col sm="10" md="8" lg="6">
                <Form.Control 
                readOnly="true"
                type="text" 
                placeholder='' 
                onChange={(e) => updateAssignment("branch", e.target.value)} 
                value={assignment.branch} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="my-3" controlId="videoUrl">
              <Form.Label column sm="2">
                CodeReview Video URL:
              </Form.Label>
              <Col sm="10" md="8" lg="6">
                <Form.Control 
                type="url" 
                onChange={(e) => updateAssignment("videoUrl", e.target.value)} 
                value={assignment.videoUrl} />
              </Col>
            </Form.Group>
            {assignment.status === "Completed" ? (
                <Button size='lg' onClick={() => save(assignmentStatuses[2].status)}>Reclaim</Button>

            ) : (
                <Button size='lg' onClick={() => save(assignmentStatuses[4].status)}>Accept</Button>
            )}
            {assignment.status === "Needs update" ? (
                (<Button size='lg' onClick={() => save(assignmentStatuses[2].status)}>Reclaim</Button>)
            ):
                (<Button size='lg' onClick={() => save(assignmentStatuses[3].status)}>Request Changes</Button>)
            }
            <Button size='lg' onClick={() => navigate("/dashboard")}>Go Back</Button>
        </>
        ) : (
        <></>
        )}
    </Container>
    );
};
  
  export default CodeReviewAssignmentView;