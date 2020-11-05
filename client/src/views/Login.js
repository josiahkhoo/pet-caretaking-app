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
  Button
} from "shards-react";

import { Dispatcher, Constants } from "../flux";

const Login = withRouter(({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstLoad, setFirstLoad] = useState(true);

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
    try {
      setFirstLoad(true);
      if (checkFormState()) {
        return
      }
      const body = { username, password };
      await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.status >= 400) {
            alert("Wrong password!")
          }
          console.log(response.json)
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          handleLogin();
          history.push("/home");
        });
    } catch (error) {
      console.log(error)
      alert("An error has occurred")
    }
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
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    invalid={!isFirstLoad && username == ""}
                    onChange={(e) => setUsername(e.target.value)}
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
                    required
                    invalid={!isFirstLoad && password == ""}
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
