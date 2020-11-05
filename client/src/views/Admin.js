import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import { Redirect } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import TakenCarePets from "../components/dashboard-view/TakenCarePets";
import HighestPetDays from "../components/dashboard-view/HighestPetDays";
import Underperforming from "../components/dashboard-view/Underperforming";
import AverageSatisfaction from "../components/dashboard-view/AverageSatisfaction";
import TotalSalary from "../components/dashboard-view/TotalSalary";
import TakenCarePetsChart from "../components/dashboard-view/TakenCarePetsChart";

import Store from "../flux/store";

const Admin = () => {
  const user = Store.getUser();
  console.log(user)
  if (user == null) return <Redirect to="/login" />;
  if (!user.is_pcs_admin) return <Redirect to="/errors" />;

  return(
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

    {/* <Row className="mb-4">
      <Col>
        <TakenCarePetsChart />
      </Col>
    </Row> */}
    
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

    <Row className="mb-4">
      <Col>
        <TotalSalary />
      </Col>
    </Row>

  </Container>
  );
};

export default Admin;
