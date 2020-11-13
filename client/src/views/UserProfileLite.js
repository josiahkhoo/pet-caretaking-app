import React from "react";
import { Container, Row, Col } from "shards-react";
import { Redirect } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import UserDetails from "../components/user-profile-lite/UserDetails";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";
import TakeCareCategory from "../components/care-taker/TakeCareCategory";
import Store from "../flux/store";

const UserProfileLite = () => {
  const user = Store.getUser();
  if (user == null) return <Redirect to="/login" />;
  console.log(user)

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="User Profile"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails user={user} />
        </Col>
        <Col lg="8">
          <UserAccountDetails user={user}/>
        </Col>
      </Row>
      <Row>
        <Col>
          <TakeCareCategory user={user} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileLite;
