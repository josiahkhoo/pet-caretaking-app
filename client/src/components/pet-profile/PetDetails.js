import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress,
} from "shards-react";
import Category from "../user-profile-lite/Category";

const PetDetails = ({ pet }) => (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      {
        <div className="mb-3 mx-auto">
          <img
            className="rounded-circle"
            src={pet.image_url}
            alt={pet.pet_name}
            width="200"
          />
        </div>
      }
      <h4 className="mb-0">{pet.pet_name}</h4>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          Owner: {pet.pet_owner_user_id}
        </strong>
        <Category name={pet.category_name} />
        <span>Special Requirements: {pet.special_requirements}</span>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

export default PetDetails;
