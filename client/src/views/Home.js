import React from "react";
import { Redirect } from "react-router-dom";

import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import List from "../components/home/UserList";
import Store from "../flux/store";
import PetOwner from "../components/PetOwner";
import Admin from "./Admin";
import CareTaker from "./CareTaker";

const Home = () => {
  const user = Store.getUser();
  console.log(user);

  if (user == null) return <Redirect to="/login" />;
  if (user.is_pcs_admin) return <Redirect to="/admin" />;
  if (user.is_pet_owner) return <Redirect to="/pet-owner" />;
  else return <Redirect to="/care-taker" />;

};

export default Home;
