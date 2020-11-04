import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Row, Container, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import EditPetForm from "../components/edit-pet/EditPetForm";

export default class EditPet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pet: null,
    };
  }

  componentDidMount() {
    const { pet } = this.props.location.state;
    this.setState({
      pet: pet,
    });
  }
  render() {
    const { pet } = this.state;
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Edit Pet" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            {pet !== null ? <EditPetForm pet={pet} /> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
