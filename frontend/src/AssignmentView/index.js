import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import ajaxTest from '../Services/fetchService';
import StatusPill from '../StatusPill';
import { useLocalState } from '../util/useLocalStorage';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useUser } from '../UserProvider';

const AssignmentView = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  // const assignmentId = window.location.href.split("/assignments/")[1];
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    number: null,
    status: null,
  });
  
  const [assignmentEnums, setAssignmentEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);
  const [comment,setComment] = useState({
    text: "",
    assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
    user: user.jwt
  });
  const prevAssignmentValue = useRef(assignment);

  function updateAssignment(prop, value) {
    const newAssignment = { ...assignment };
    newAssignment[prop] = value;
    setAssignment(newAssignment);
  }

  function save(status) {
    if(status && assignment.status !== status){
      updateAssignment("status", status);
    }else{
      persist()
      }
  }

  const [comments,setComments] = useState([]);

  function saveComment(){
    ajaxTest('/api/comments', "POST", user.jwt, comment).then((comment) =>{
      const commentsCopy = [ ...comments];
      commentsCopy.push(comment);
      setComments(commentsCopy);
      
    })
  }

  useEffect(() => {
    ajaxTest(`/api/comments?assignmentId=${assignmentId}`, "GET", user.jwt, null).then(
      (data) =>{
        setComments(data);
      }
    )
  },[])

  function updateComment(value){
    const commentCopy = { ...comment}
    commentCopy.text = value;
    setComment(commentCopy);
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
            <Form.Group as={Row} className="my-3" controlId="assignmentName">
              <Form.Label column sm="2">
                Assignment Number:
              </Form.Label>
              <Col sm="10" md="8" lg="6">
                <DropdownButton
                  as={ButtonGroup}
                  variant={"info"}
                  title= {assignment.number ? `Assignment ${assignment.number}` : "Select Assignmnet"}
                  onSelect={(selectedElement) => {
                    updateAssignment("number", selectedElement)
                  }}
                >
                  {assignmentEnums.map((assignmentEnum) => (
                    <DropdownItem 
                    key={assignmentEnum.assignmentNum}
                    eventKey={assignmentEnum.assignmentNum}
                    >
                      {assignmentEnum.assignmentNum}
                    </DropdownItem>
                  ))}
                </DropdownButton>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="my-3" controlId="githubUrl">
              <Form.Label column sm="2">
                GitHub URL:
              </Form.Label>
              <Col sm="10" md="8" lg="6">
                <Form.Control 
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
                type="text" 
                placeholder='' 
                onChange={(e) => updateAssignment("branch", e.target.value)} 
                value={assignment.branch} />
              </Col>
            </Form.Group>

            {assignment.status === "Completed" ? (       
            <>
            <Form.Group as={Row} className="mb-3 d-flex align-items-center" controlId="videoUrl">
              <Form.Label column sm="2">
                Code Review Video URL:
              </Form.Label>
              <Col sm="10" md="8" lg="6">
                <a href={assignment.videoUrl}>{assignment.videoUrl}</a>
              </Col>
            </Form.Group>     
            <Button size='lg' onClick={() => navigate("/dashboard")}>Go Back</Button>
            </>)
             : assignment.status === "Pending Submission" ? (
            <>
            <Button size='lg' onClick={() => save("Submitted")}>Submit Assignment</Button>
            <Button size='lg' onClick={() => navigate("/dashboard")}>Go Back</Button>
            </>) : 
            <>
            <Button size='lg' onClick={() => save("Resubmitted")}>Resubmit Assignment</Button>
            <div className='mt-5'>
              <textarea style={{width: "100%"}} onChange={(e) => updateComment(e.target.value)}>

              </textarea>
              <Button size='lg' onClick={() => saveComment()}>Add comment</Button>
            </div>
            <div className='mt-3'>
              {comments.map(comment => <div><span style={{fontWeight: "bold"}}>{comment.creator.name}: </span>{comment.comment}</div>)}
            </div>
            </>
            }
        </>
        ) : (
        <></>
        )}
    </Container>
    )
}
  
  export default AssignmentView;