import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import CreateReview from "./views/CreateReview";
import PetOwner from "./views/PetOwner";
import AddNewPet from "./views/AddNewPet";
import CreateBid from "./views/CreateBid";
import Admin from "./views/Admin";
import CareTaker from "./views/CareTaker";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: Home,
  },
  {
    path: "/login",
    layout: DefaultLayout,
    component: Login,
  },
  {
    path: "/register",
    layout: DefaultLayout,
    component: Register,
  },
  {
    path: "/home",
    layout: DefaultLayout,
    component: Home,
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview,
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite,
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost,
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors,
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview,
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables,
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts,
  },
  {
    path: "/create-review",
    layout: DefaultLayout,
    component: CreateReview,
  },
  {
    path: "/pet-owner",
    layout: DefaultLayout,
    component: PetOwner,
  },
  {
    path: "/add-new-pet",
    layout: DefaultLayout,
    component: AddNewPet,
  },
  {
    path: "/create-bid",
    layout: DefaultLayout,
    component: CreateBid,
  },
  {
    path: "/admin",
    layout: DefaultLayout,
    component: Admin,
  },
  {
    path: "/care-taker",
    layout: DefaultLayout,
    component: CareTaker,
  },
];
