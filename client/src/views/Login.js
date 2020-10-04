import React, { useState } from "react";
import {
    Container, Row, Col,
    FormInput,
    CardBody,
    Card,
    CardFooter,
    Button
} from "shards-react";

import Editor from "../components/add-new-post/Editor";
import InputTodo from "../components/home/InputTodo";
import List from "../components/home/UserList";

const Home = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const checkFormState = () => {
        return email == "" || password == "";
    }

    const onRegister = async (e) => {
        if (!checkFormState) {
            console.log("Empty fields")
        }
        try {
            const body = { email, password }
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            console.log(response);
        } catch (error) {
            console.log(error);
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
                                {/* Email */}
                                <Col lg="3">
                                    <label className="mt-2">Email</label>
                                </Col>
                                <Col>
                                    <FormInput
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
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
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </Col>
                            </Row>

                        </CardBody>
                        <CardFooter className="d-flex justify-content-center">
                            <Button className="mr-2"> Login </Button>
                            <Button className="ml-2" onClick={onRegister}> Register </Button>
                        </CardFooter>

                    </Card>
                </Col>
                <Col lg="3" />
            </Row>



        </Container>
    );
};

export default Home;
