import React, { useState } from "react";

import {
    Container,
    Row,
    Col,
    FormGroup,
    FormInput,
    Button
} from "shards-react";

const InputTodo = () => {
    const [description, setDescription] = useState("default");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { description }
            const response = await fetch("http://localhost:5000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            console.log(response);
            // refresh page to show changes
            window.location = "/";
        } catch (error) {

        }
    };

    return (
        <Container>
            <h1>Header 1</h1>
            <Col md="6" className="form-group">
                <label>City</label>
                <FormInput
                    id="feCity"
                    placeholder=""
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </Col>
                <Button onClick={onSubmitForm} theme="accent">Update Account</Button>

      </Container>
    );
};

export default InputTodo;