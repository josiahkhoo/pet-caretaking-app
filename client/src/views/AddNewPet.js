import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Row, Container, Col } from "shards-react";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import AddNewPetForm from "../components/add-new-pet/AddNewPetForm";
import PageTitle from "../components/common/PageTitle";

export default class AddNewPet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petOwnerUserId: null,
    };
  }

  componentDidMount() {
    const { petOwnerUserId } = this.props.location.state;
    console.log(petOwnerUserId);
    this.setState({
      petOwnerUserId: petOwnerUserId,
    });
  }

  render() {
    const { petOwnerUserId } = this.state;
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Add Pet" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <AddNewPetForm petOwnerUserId={petOwnerUserId} />
          </Col>

          {/* Sidebar Widgets */}
          <Col lg="3" md="12"></Col>
        </Row>
      </Container>
    );
  }
}
