import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Container,
  Col,
  Button,
} from "shards-react";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import PageTitle from "../components/common/PageTitle";
import PetDetails from "../components/pet-profile/PetDetails";
import Store from "../flux/store";
import { Link } from "react-router-dom";

export default class PetProfile extends Component {
  static propTypes = {
    prop: PropTypes,
  };
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      pet: null,
    };
  }

  async getPet(petOwnerUserId, petName) {
    try {
      const res = await fetch(`/pet-owners/${petOwnerUserId}/pets/${petName}`);
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
    this.setState({
      user: Store.getUser(),
    });
  }

  isOwner(pet, user) {
    if (user === null || pet === null) {
      return false;
    }
    return user.user_id === pet.pet_owner_user_id;
  }

  render() {
    const { pet, user } = this.state;
    console.log(pet);
    console.log(user);
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Pet" className="text-sm-left" />
        </Row>

        <Row>
          <Col lg="4" md="12">
            {pet !== null ? <PetDetails pet={pet} /> : null}
          </Col>
        </Row>

        {this.isOwner(pet, user) ? (
          <Row>
            <Col lg="4" md="12">
              <div class="float-right">
                <Button
                  tag={Link}
                  to={{
                    pathname: "edit-pet",
                    state: {
                      pet: pet,
                    },
                  }}
                >
                  Edit Pet
                </Button>
              </div>
            </Col>
          </Row>
        ) : null}
      </Container>
    );
  }
}
