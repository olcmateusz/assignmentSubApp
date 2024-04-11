import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusPill = (properties) => {

    const {value} = properties;

    function getPillColor() {
        switch(value){
            case 'Completed':
                return "success";
            case 'In review':
                return "info";
            case "Danger":
                return 'danger';
            case "Pending Submission":
                return 'warning';
            default:
                return 'primary';
        }

    }


    return (
        <Badge pill bg={getPillColor()} style={{ fontSize: "1em" }}>
            {value}
        </Badge>
    );
};

export default StatusPill;