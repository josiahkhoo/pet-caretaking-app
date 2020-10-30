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
} from "shards-react";
import { Dispatcher, Constants, Store } from "../flux";

const Login = withRouter(({ history }) => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkFormState = () => {
    return username == "" || password == "";
  };

  const onRegister = () => {
    history.push("/register");
  };

  const handleLogin = () => {
    Dispatcher.dispatch({
      actionType: Constants.USER_LOG_IN,
    });
  };

  const onLogin = async (e) => {
    if (!checkFormState) {
      console.log("Empty fields");
    }
    const body = { username, password };
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Invalid response");
        }
        return response.json();
      })
      .then((data) => {
        // Login success
        sessionStorage.setItem("user", JSON.stringify(data));
        console.log(sessionStorage.getItem)
        handleLogin();
        history.push("/home");
      });
  };

  return (
    <Container fluid className=" main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="d-flex justify-content-center py-4">
        <h1>Login</h1>
      </Row>

      <Row form>
        <Col lg="3" />
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
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Col>
              </Row>
              <Row className="mt-5">
                {/* Password */}
                <Col lg="3">
                  <label className="mt-2">Password</label>
                </Col>
                <Col>
                  <FormInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="d-flex justify-content-center">
              <Button className="mr-2" onClick={onLogin}>
                {" "}
                Login{" "}
              </Button>
              <Button className="ml-2" onClick={onRegister}>
                {" "}
                Register{" "}
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col lg="3" />
      </Row>
    </Container>
  );
});

export default Login;
