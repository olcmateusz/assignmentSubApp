import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserProvider';


const Login = () => {

    const user = useUser();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        if (user.jwt) navigate("/dashboard");
    },[user])

    function sendLoginRequest(){
        
        const reqBody = {
        "username": username,
        "password": password
        }
    
        // ajaxTest("api/auth/login", "POST", jwt, reqBody)
        fetch("api/auth/login", {
        headers: {
            "Content-Type": "application/json"
        },
        method:"post",
        body: JSON.stringify(reqBody)
        })
        .then(response => {
            if (response.status === 200)
                return Promise.all([response.json(), response.headers])
            else{
                return Promise.reject("invalid login attempt");
            }
        })
        .then(([body, headers]) => {
            user.setJwt(headers.get("authorization"));
            // setJwt(headers.get("authorization"));
            // navigate("/dashboard", {replace: true});
            // window.location.href = "/dashboard";
        }).catch((message) => {
            alert(message);
        })
    
          
    }

    return (
        <>
        <Container className="mt-5">
            <Row className="justify-content-center align-items-center">
                <Col md="6" lg="8">
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label className="fs-2">Username</Form.Label>
                        <Form.Control
                            type="email" 
                            size="lg"
                            placeholder="JoeBajden@gmail.com"
                            value={username} 
                            onChange={(event) => setUsername(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-center align-items-center">
                <Col md="6" lg="8">
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="fs-2">Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter your password"
                            size="lg"
                            value={password} 
                            onChange={(event) => setPassword(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-center align-items-center">
                <Col 
                className=" mt-2 d-flex flex-column gap-3 flex-md-row justify-content-md-right"
                md="6"
                lg="8"
                >
                    <Button 
                        id='submit' 
                        size='lg' 
                        type='button' 
                        variant='dark' 
                        onClick={() => sendLoginRequest()}>
                        Login
                    </Button>
                    <Button  
                        size='lg' 
                        type='button' 
                        variant='dark' 
                        onClick={() => navigate("/")}>
                        Exit
                    </Button>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Login;