import React, { Component } from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import CreateReviewForm from "../components/create-review/CreateReviewForm";

class CreateReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: null,
    };
  }

  componentDidMount() {
    const { bid } = this.props.location.state;
    this.setState({
      bid: bid,
    });
  }

  render() {
    const { bid } = this.state;
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Create Review"
            subtitle="For the bid service that you recently had"
            className="text-sm-left"
          />
        </Row>

        <Col lg="8" className="mb-4">
          <CreateReviewForm bid={bid} />
        </Col>
      </Container>
    );
  }
}

export default CreateReview;
