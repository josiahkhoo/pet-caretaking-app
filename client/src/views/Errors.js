import React from "react";
import { Container, Button } from "shards-react";
import { withRouter } from "react-router-dom";

const Errors = withRouter(({ history }) => {
  return (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h3>Something went wrong!</h3>
        <p>There was a problem on our end. Please try again later.</p>
        <Button pill onClick={history.goBack()}>&larr; Go Back</Button>
      </div>
    </div>
  </Container>
  )
});

export default Errors;
