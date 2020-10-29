import React, { useState } from "react";
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
  FormCheckbox,
  Form
} from "shards-react";

const Register = withRouter(({ history }) => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isCareTaker, setCareTaker] = useState(false);
  const [isPetOwner, setPetOwner] = useState(true);

  const checkFormState = () => {
    return username.length == 0 || password.length === 0 || confirmPassword === ""
      || name.length == 0 || contactNumber.length === 0 || address.length === 0;
  };

  const onRegister = async (e) => {
    console.log(checkFormState())
    // setValidated(true);
    if (checkFormState()) {
      alert("Bad inputs");
    }
    // try {
    //   const body = { username, password };
    //   const response = await fetch("http://localhost:5000/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });

    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
  };

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
                  <FormInput required
                    type="username"
                    placeholder="Username"
                    value={username}
                    required
                    invalid={true}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {/* <FormFeedback>The username is taken.</FormFeedback> */}

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
                    placeholder="Password"
                    required
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
                    placeholder="Password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
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
                    invalid={false}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder=""
                    required
                    invalid={false}
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
                    placeholder=""
                    required
                    invalid={false}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                {/* User Type */}
                <Col>
                <FormCheckbox name="userType"
                defaultChecked
                onChange={(e) => setPetOwner(!isPetOwner)}>Pet Owner</FormCheckbox>
                </Col>
                <Col>
                <FormCheckbox 
                name="userType"
                onChange={(e) => setCareTaker(!isCareTaker)}
                >Care Taker</FormCheckbox>
                </Col>
              </Row>


            </CardBody>
            <CardFooter className="d-flex justify-content-center">
              <Button className="ml-2" onClick={onRegister}>
                {" "}
                Register{" "}
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="2" />
      </Row>
    </Container>
  );
});

export default Register;
