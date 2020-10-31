import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import TakenCarePets from "../components/dashboard-view/TakenCarePets";
import RatingDropdown from "../components/create-review/RatingDropdown.js"
import HighestPetDays from "../components/dashboard-view/HighestPetDays";
import Underperforming from "../components/dashboard-view/Underperforming";
import AverageSatisfaction from "../components/dashboard-view/AverageSatisfaction";

const Admin = () => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Admin Dashboard" subtitle="View Information on" className="text-sm-left" />
    </Row>
    
    <Row className="mb-4">
      <Col>
        <TakenCarePets />
      </Col>
    </Row>
    
    <Row className="mb-4">
      <Col>
        <HighestPetDays />
      </Col>
    </Row>

    <Row className="mb-4">
      <Col>
        <Underperforming />
      </Col>
    </Row>

    <Row className="mb-4">
      <Col>
      <AverageSatisfaction />
      </Col>
    </Row>

  </Container>
);

export default Admin;
