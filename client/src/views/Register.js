import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  FormInput,
  CardBody,
  Card,
  CardFooter,
  Button,
  FormFeedback,
  FormRadio,
} from "shards-react";

import Store from "./../flux/store"

const Register = withRouter(({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  // Part-time caretaker and petowner is selected by default
  const [is_pet_owner, setPetOwner] = useState(true);
  const [is_full_time_ct, setFullTime] = useState(false);
  const [is_part_time_ct, setPartTime] = useState(true);
  const [isFirstLoad, setFirstLoad] = useState(true);
  const is_pcs_admin = false;

  const [isLoading, setLoading] = useState(false);

  const emptyFormState = () => {
    return (
      username.length == 0 ||
      password.length === 0 ||
      confirmPassword.length == 0 ||
      name.length == 0 ||
      contact_number.length === 0 ||
      address.length === 0
    );
  };

  const onRegister = () => setLoading(true);

  useEffect(() => {
    if (isLoading) {
      register().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const register = async () => {
    setFirstLoad(false);
    if (emptyFormState()) {
      return;
    }
    const body = {
      username,
      password,
      name,
      contact_number,
      address,
      is_pet_owner,
      is_full_time_ct,
      is_part_time_ct,
      is_pcs_admin,
    };
    var responseStatus;
    try {
      await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => {
          responseStatus = res.status;
          return res.json();
        })
        .then((data) => {
          if (responseStatus != 200) {
            alert(data);
          } else {
            history.push("/login");
            alert("Account successfully created!");
          }
        });
    } catch (error) {
      alert("An error has occured");
      console.log(error);
    }
  };

  if (Store.getUser() != null) {
    history.push("/")
  }

  return (
    <Container fluid className=" main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="d-flex justify-content-center py-4">
        <h1>Register</h1>
      </Row>

      <Row form>
        <Col lg="2" />
        <Col className="form-group">
          <Card>
            <CardBody>
              <Row>
                {/* Username */}
                <Col lg="3">
                  <label className="mt-2">Username</label>
                </Col>
                <Col>
                  <FormInput
                    required
                    type="text"
                    value={username}
                    maxLength="100"
                    required
                    invalid={!isFirstLoad && username == ""}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {/* <FormFeedback>{existingUserMsg}</FormFeedback> */}
                </Col>
              </Row>

              <Row className="mt-3">
                {/* Password */}
                <Col lg="3">
                  <label className="mt-2">Password</label>
                </Col>
                <Col>
                  <FormInput
                    type="password"
                    required
                    maxLength="100"
                    invalid={!isFirstLoad && password == ""}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                {/* Confirm Password */}
                <Col lg="3">
                  <label className="mt-2">Confirm Password</label>
                </Col>
                <Col>
                  <FormInput
                    type="password"
                    required
                    maxLength="100"
                    invalid={!isFirstLoad && confirmPassword != password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <FormFeedback>Passwords do not match</FormFeedback>
                </Col>
              </Row>

              <Row className="mt-3">
                {/* Name */}
                <Col lg="3">
                  <label className="mt-2">Full Name</label>
                </Col>
                <Col>
                  <FormInput
                    placeholder=""
                    required
                    maxLength="100"
                    invalid={!isFirstLoad && name == ""}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                {/* Contact Number */}
                <Col lg="3">
                  <label className="mt-2">Contact Number</label>
                </Col>
                <Col>
                  <FormInput
                    type="number"
                    maxLength="8"
                    placeholder=""
                    required
                    invalid={!isFirstLoad && contact_number == ""}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                {/* Address */}
                <Col lg="3">
                  <label className="mt-2">Address</label>
                </Col>
                <Col>
                  <FormInput
                    placeholder="price"
                    maxLength="255"
                    required
                    invalid={!isFirstLoad && address == ""}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                {/* User Type */}
                <Col lg="3">
                  <label className="mt-1">Are you a pet owner?</label>
                </Col>
                <Col>
                  <FormRadio
                    name="isPetOwner"
                    defaultChecked
                    onChange={(e) => setPetOwner(true)}
                  >
                    Yes
                  </FormRadio>
                </Col>
                <Col>
                  <FormRadio
                    name="isPetOwner"
                    onChange={(e) => setPetOwner(false)}
                  >
                    No
                  </FormRadio>
                </Col>
              </Row>

              <Row className="mt-4">
                {/* CareTaker Type */}
                <Col lg="3">
                  <label className="mt-1">Are you a care taker?</label>
                </Col>
                <Col>
                  <FormRadio
                    name="isCareTaker"
                    defaultChecked
                    onChange={(e) => {
                      setFullTime(false);
                      setPartTime(true);
                    }}
                  >
                    Part Time
                  </FormRadio>
                </Col>
                <Col>
                  <FormRadio
                    name="isCareTaker"
                    onChange={(e) => {
                      setFullTime(true);
                      setPartTime(false);
                    }}
                  >
                    Full Time
                  </FormRadio>
                </Col>
                <Col>
                  <FormRadio
                    name="isCareTaker"
                    onChange={(e) => {
                      setFullTime(false);
                      setPartTime(false);
                    }}
                  >
                    No
                  </FormRadio>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="d-flex justify-content-center">
              <Row>
                <Button
                  className="ml-2"
                  onClick={!isLoading ? onRegister : null}
                >
                  {isLoading ? "Loading…" : "Create Account"}
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="2" />
      </Row>
    </Container>
  );
});

export default Register;
