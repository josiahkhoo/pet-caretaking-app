import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";

const NoNavLayout = ({ children, noNavbar, noFooter, user }) => {
  return (
    <Container fluid>
      <Row>
        <Col
          className="main-content p-0"
          tag="main"
        >
          {!noNavbar && <MainNavbar />}
          {children}
        </Col>
      </Row>
    </Container>
  );
};

NoNavLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
  /**
   * User
   */
  user: PropTypes.object,
};

NoNavLayout.defaultProps = {
  noNavbar: true,
  noFooter: true,
  user: null,
};

export default NoNavLayout;
