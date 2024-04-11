import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ajaxTest from '../Services/fetchService';
import { useUser } from '../UserProvider';

const PrivateRoute = (props) => {

    const user = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(null);
    const { children } = props;
    if(user) {
        ajaxTest(`/api/auth/validate?token=${user.jwt}`, "GET", user.jwt).then(
            (isValid) => {
                setIsValid(isValid);
                setIsLoading(false);
            });
    } else {
        return <Navigate to="/login"></Navigate>;
    }

    return isLoading ? (<div>Loading</div>) : (isValid===true) ? children : (<Navigate to="/login"></Navigate>)
    
}

export default PrivateRoute;