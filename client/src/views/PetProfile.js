import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Row, Container, Col } from "shards-react";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import PageTitle from "../components/common/PageTitle";
import PetDetails from "../components/pet-profile/PetDetails";

export default class PetProfile extends Component {
  static propTypes = {
    prop: PropTypes,
  };
  constructor(props) {
    super(props);
    this.state = {
      pet: null,
    };
  }

  async getPet(petOwnerUserId, petName) {
    try {
      const res = await fetch(
        `http://localhost:5000/pet-owners/${petOwnerUserId}/pets/${petName}`
      );
      return res.json();
    } catch (error) {
      return null;
    }
  }

  componentDidMount() {
    const { pet, petOwnerUserId, petName } = this.props.location.state;
    if (pet !== null) {
      this.setState({
        pet: pet,
      });
    } else {
      this.getPet(petOwnerUserId, petName).then((res) => {
        this.setState({
          pet: res,
        });
      });
    }
  }

  render() {
    const { pet } = this.state;
    console.log(pet);
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Pet" className="text-sm-left" />
        </Row>

        <Row>
          <Col lg="3" md="12">
            {pet !== null ? <PetDetails pet={pet} /> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
