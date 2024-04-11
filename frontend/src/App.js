import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import Homepage from './Homepage';
import CodeReviewerDashboard from './CodeReviewerDashboard';
import Login from './Login';
import AssignmentView from './AssignmentView';
import PrivateRoute from './PrivateRoute';
import { useLocalState } from './util/useLocalStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwtDecode from 'jwt-decode';
import CodeReviewAssignmentView from './CodeReviewAssignmentView';
import { UserProvider, useUser } from './UserProvider';

function App() {
  // const [jwt, setJwt] = useLocalState("", "jwt");
  const user = useUser();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRoles(getRolesFromJWT());
  },[user.jwt]);

  function getRolesFromJWT(){
    if(user.jwt){
      // const decodedJWT = jwt_decode(jwt);
      const decodedJWT = jwtDecode(user.jwt);
      return decodedJWT.authorities;
    }
    return [];
  }

  return (
    <Routes>

      <Route path="/dashboard" element={
        roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
      <PrivateRoute>
        <CodeReviewerDashboard/>
      </PrivateRoute>
    ) : (      
    <PrivateRoute>
      <Dashboard/>
    </PrivateRoute>)} />

      <Route path="/assignments/:assignmentId" 
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (

          <PrivateRoute>
            <CodeReviewAssignmentView />
          </PrivateRoute>
          ):
          <PrivateRoute>
          <AssignmentView />
        </PrivateRoute>
        }
      />

      <Route path="/login" element={<Login/>} />

      <Route path="/" element={<Homepage/>} />

    </Routes>
  )
}

export default App;
