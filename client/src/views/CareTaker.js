import React from "react";
import { Redirect } from "react-router-dom";

import { Container, Row, Col, Card, CardBody } from "shards-react";
import BidView from "../components/care-taker-view/bidView";
import AvailabilityForm from "../components/care-taker/AvailabilityForm";
import SalaryCard from "../components/care-taker/SalaryCard";
import ViewAvailability from "../components/care-taker/ViewAvailability";
import PageTitle from "../components/common/PageTitle";
import UserDetails from "../components/user-profile-lite/UserDetails";
import Store from "../flux/store";

const CareTaker = () => {
  const user = Store.getUser();
  if (user == null) return <Redirect to="/login" />;
  if (user.is_full_time == undefined) return <Redirect to="/errors" />;

  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Care Taker"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col lg="8" className="mb-4">
          <BidView user={user}></BidView>
        </Col>

        <Col lg="4" className="mb-4">
          <UserDetails user={user} />
          <SalaryCard careTakerUserId={user.user_id} />
        </Col>
      </Row>
      <AvailabilityForm user={user} />
      <ViewAvailability user={user} />
    </Container>
  );
};

export default CareTaker;
