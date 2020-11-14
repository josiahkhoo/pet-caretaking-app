import React, {useState} from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import UserDetails from "../components/user-profile-lite/UserDetails";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";
import { useHistory, useParams } from "react-router-dom";

const UserProfileExternal = () => {
  let { user_id } = useParams();


  const getUser = async (userId) => {
    try {
      const res = await fetch(`/users/${userId}`);
      return res.json();
    } catch (error) {
      alert("An error has occurred")
      return null;
    }
  }

  const [user, setUser] = useState(null);
  
  // Todo: add some loading indicator
  if (user == null) {
    getUser(user_id).then(user => setUser(user), err => console.log(err));
    return<div/>
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="User Profile"
          subtitle="Overview"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="3" md="0"></Col>
        <Col lg="6" md="12">
          <UserDetails user={user} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileExternal;
