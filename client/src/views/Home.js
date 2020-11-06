import React from "react";
import { Redirect } from "react-router-dom";

import Store from "../flux/store";

const Home = () => {
  const user = Store.getUser();

  if (user == null) return <Redirect to="/login" />;
  if (user.is_pcs_admin) return <Redirect to="/admin" />;
  if (user.is_pet_owner) return <Redirect to="/pet-owner" />;
  else return <Redirect to="/care-taker" />;
};

export default Home;
