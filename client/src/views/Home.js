import React from "react";
import { Container, Row, Col } from "shards-react";
import AddNewPetForm from "../components/add-new-pet/AddNewPetForm";

import PageTitle from "../components/common/PageTitle";
import CreateNewBidForm from "../components/create-new-bid/CreateNewBidForm";
import InputTodo from "../components/home/InputTodo";
import List from "../components/home/UserList";


const Home = () => {
  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Add New Post"
          subtitle="Blog Posts"
          className="text-sm-left"
        />
      </Row>

      {/* Editor */}
      <CreateNewBidForm />
      <AddNewPetForm />
      <List />
      {/* <InputTodo /> */}
    </Container>
  );
};

export default Home;
