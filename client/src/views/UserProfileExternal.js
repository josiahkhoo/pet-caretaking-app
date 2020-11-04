import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Row, Container, Col } from "shards-react";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import PageTitle from "../components/common/PageTitle";
import UserDetails from "../components/user-profile-lite/UserDetails";

export default class UserProfileExternal extends Component {
  static propTypes = {
    prop: PropTypes,
  };
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  async getUser(userId) {
    try {
      const res = await fetch(`http://localhost:5000/users/${userId}`);
      return res.json();
    } catch (error) {
      return null;
    }
  }

  componentDidMount() {
    const { user, userId } = this.props.location.state;
    if (user !== null) {
      this.setState({
        user: user,
      });
    } else {
      this.getUser(userId).then((res) => {
        this.setState({
          user: res,
        });
      });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="User Profile" className="text-sm-left" />
        </Row>

        <Row>
          <Col lg="6" md="12">
            {user !== null ? <UserDetails user={user} /> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
