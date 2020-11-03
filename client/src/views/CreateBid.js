import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Row, Container, Col } from "shards-react";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import PageTitle from "../components/common/PageTitle";
import CreateNewBidForm from "../components/create-new-bid/CreateNewBidForm";
import UserDetails from "../components/user-profile-lite/UserDetails";

export default class CreateBid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petOwnerUserId: null,
      careTaker: null,
    };
  }

  componentDidMount() {
    const { petOwnerUserId } = this.props.location.state;
    console.log(petOwnerUserId);
    this.setState({
      petOwnerUserId: petOwnerUserId,
    });
  }

  onCareTakerChange(careTaker) {
    this.setState({ careTaker: careTaker });
  }

  render() {
    const { petOwnerUserId, careTaker } = this.state;
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Create Bid" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <CreateNewBidForm
              petOwnerUserId={petOwnerUserId}
              handleCareTakerChange={(careTaker) =>
                this.onCareTakerChange(careTaker)
              }
            />
          </Col>

          {/* Sidebar Widgets */}
          <Col lg="3" md="12">
            {careTaker !== null ? <UserDetails user={careTaker} /> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
