import React, { useState }  from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  Button
} from "shards-react";

const UserAccountDetails = ({ user }) => {
  
  const [contact_number, setNumber] = useState(user.contact_number);
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address);
  const [password, setPassword] = useState(user.password);

  const updateAccount = async () => {
    try {
      const user_id = user.user_id;
      const body = { name, password, contact_number, address };
      const url = process.env.BACKEND_URL || "http://localhost:5000";
      await fetch(url.concat(`/users/${user_id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          alert("Update success")
        });
    } catch (error) {
      console.log(error)
      alert("An error has occurred")
    }
  }

  const deleteAccount = async () => {
    try {
      const user_id = user.user_id;
      const url = process.env.BACKEND_URL || "http://localhost:5000";
      await fetch(url.concat(`/users/${user_id}`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          alert("Update success")
        });
    } catch (error) {
      console.log(error)
      alert("An error has occurred")
    }
  }

  return (
  <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">Account Details</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              
              <Row form>
                {/* Email */}
                <Col md="6" className="form-group">
                  <label htmlFor="feEmail">Username</label>
                  <FormInput
                    type="text"
                    id="feUsername"
                    placeholder="Username"
                    value={user.username}
                    disabled
                  />
                </Col>
                {/* Password */}
                <Col md="6" className="form-group">
                  <label htmlFor="fePassword">Password</label>
                  <FormInput
                    type="password"
                    id="fePassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </Col>
              </Row>

              <Row form>
                {/* Name */}
                <Col md="6" className="form-group">
                  <label htmlFor="feFirstName">Full Name</label>
                  <FormInput
                    id="feFirstName"
                    
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
                {/* Contact Num */}
                <Col md="6" className="form-group">
                  <label htmlFor="feLastName">Contact Number</label>
                  <FormInput
                    id="feLastName"
                    type="number"
                    value={contact_number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </Col>
              </Row>

              <FormGroup>
                <label htmlFor="feAddress">Address</label>
                <FormInput
                  id="feAddress"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormGroup>
              <Row form>
                {/* City */}
                <Col md="4" className="form-group">
                  <label>Pet Owner</label>
                  <FormInput
                    value={user.is_pet_owner ? "Yes" : "No"}
                    disabled
                    onChange={() => {}}
                  />
                </Col>
                {/* CT */}
                <Col md="4" className="form-group">
                  <label htmlFor="feInputState">Care Taker</label>
                  <FormInput
                    value={user.is_full_time != undefined ? "Yes" : "No"}
                    disabled
                  />
                </Col>
                {/* Admin */}
                <Col md="4" className="form-group">
                  <label htmlFor="feZipCode">Admin</label>
                  <FormInput
                    id="feZipCode"
                    value={user.is_pcs_admin ? "Yes" : "No"}
                    disabled
                  />
                </Col>
              </Row>
                <Button className="mb-2 mr-1" theme="accent" onClick={updateAccount}>Update Account</Button>

                {/* <Button className="mb-2 mr-1" theme="danger" onClick={deleteAccount}>Delete Account</Button> */}

            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
)};

export default UserAccountDetails;
