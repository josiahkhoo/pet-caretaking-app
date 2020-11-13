

import React, {useEffect, useState} from "react";
import { Redirect } from "react-router-dom";
import {
  Card,
  Row, Col,
  CardHeader,
  CardBody,
  Button,
  FormCheckbox,
  CardFooter
} from "shards-react";


const TakeCareCategory = ({ user }) => {
  if (user == null) return <Redirect to="/login" />;
  if (user.is_full_time == undefined) return <Redirect to="/errors" />;

  
  const update = () => {

  }

  // useEffect(async () => {
  //   try {
  //     const result = await fetch(`/caretakers/availability/user/${user.user_id}`, {
  //       method: "GET"
  //     }).then((response) => {
  //       return response.json()
  //     })
  //     setData(result)
  //     setLoading(false)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // if (isLoading) return null;

  return (
      <Card>
      <CardHeader className="border-bottom">
        <h6 className="m-0">Pet Categories To Take Care</h6>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg="3">
            <FormCheckbox
              name="isCareTaker"
              onChange={(e) => {
              }}
            >
              Rabbits
            </FormCheckbox>
          </Col>
          <Col lg="3">
            <FormCheckbox
              name="isCareTaker"
              onChange={(e) => {
              }}
            >
              Hamsters
            </FormCheckbox>
          </Col>
        </Row>
        <Row>
          <Col lg="3">
            <FormCheckbox
              name="isCareTaker"
              onChange={(e) => {
              }}
            >
              Cats
            </FormCheckbox>
          </Col>
          <Col lg="3">
            <FormCheckbox
              name="isCareTaker"
              onChange={(e) => {
              }}
            >
              Dogs
            </FormCheckbox>
          </Col>
        </Row>
        <Row>
          <Col lg="3">
            <FormCheckbox
              name="isCareTaker"
              onChange={(e) => {
              }}
            >
              Birds
            </FormCheckbox>
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="mb-5">
        <Button className="mr-2" onClick={update}>Update</Button>
        </CardFooter>
    </Card>
)};

export default TakeCareCategory;
