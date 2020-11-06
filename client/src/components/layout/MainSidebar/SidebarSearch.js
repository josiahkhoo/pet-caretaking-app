import React from "react";
import {
  Form,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "shards-react";

export default () => (
  <Form className="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none" style={{ display: "flex", minHeight: "45px" }}>
    <InputGroup seamless className="ml-3">
      <InputGroupAddon type="prepend">

      </InputGroupAddon>
    </InputGroup>
  </Form>
);
