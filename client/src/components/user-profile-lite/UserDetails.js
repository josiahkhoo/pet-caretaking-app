import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress
} from "shards-react";

const UserDetails = ({ user }) => (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      {/* {<div className="mb-3 mx-auto">
        <img
          className="rounded-circle"
          src={user.image_url}
          alt={user.name}
          width="200"
        />
      </div>}
      <h4 className="mb-0">{user.name}</h4> */}
      <Button pill outline size="sm" className="mb-2">
        <i className="material-icons mr-1">person_add</i>
      </Button>
    </CardHeader>
  </Card>
);

export default UserDetails;
