import React from "react";
import { Redirect } from "react-router-dom";

import { Container, Row, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Store from "../flux/store";

const CareTaker = () => {
  const user = Store.getUser();
  if (user == null) return <Redirect to="/login" />;
  if (user.is_full_time == undefined) return <Redirect to="/errors" />;

  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Care Taker Home Page" className="text-sm-left" />
      </Row>
    </Container>
  )
};

export default CareTaker;
