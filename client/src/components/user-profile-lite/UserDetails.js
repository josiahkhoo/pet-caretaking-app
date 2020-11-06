import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Progress,
  Row,
  Col,
} from "shards-react";
import CaretakerInfo from "./CaretakerInfo";

const UserDetails = ({ user }) => (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      {
        <div className="mb-3 mx-auto">
          <img
            className="rounded-circle"
            src={
              user == null ? "./../../assets/default_image.png" : user.image_url
            }
            // alt={user.name}
            width="200"
          />
        </div>
      }
      {/* <h4 className="mb-0">{user.name}</h4> */}
      <div
        className="d-flex justify-content-center"
        style={{
          marginTop: 10,
        }}
      >
        {user.is_full_time !== null ? (
          <div
            className="bg-success text-white text-center rounded p-2"
            style={{
              boxShadow: "inset 2 2 2px rgba(0,0,0,.1)",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            Caretaker
          </div>
        ) : null}
        {user.is_pet_owner === true ? (
          <div
            className="bg-info text-white text-center rounded p-2"
            style={{
              boxShadow: "inset 2 2 2px rgba(0,0,0,.1)",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            Pet Owner
          </div>
        ) : null}
        {user.is_pcs_admin === true ? (
          <div
            className="bg-danger text-white text-center rounded p-2"
            style={{
              boxShadow: "inset 2 2 2px rgba(0,0,0,.1)",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            Admin
          </div>
        ) : null}
      </div>
    </CardHeader>
    {user.is_full_time !== null ? (
      <CardBody>
        <CaretakerInfo careTakerUserId={user.user_id} />
      </CardBody>
    ) : null}
  </Card>
);

export default UserDetails;
