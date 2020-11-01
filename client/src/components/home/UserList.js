import React, { useState, useEffect } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader
} from "shards-react";

const UserList = () => {
    const [users, setUsers] = useState([])

    const getList = async () => {
        try {
            const response = await fetch("http://localhost:5000/users");
            const jsonData = await response.json()

            setUsers(jsonData);
            // refresh page to show changes
        } catch (error) {

        }
    };
    useEffect(() => {
        getList();
    }, [])

    return (
        <Card className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Active Users</h6>
          </CardHeader>
          <CardBody className="">
            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">
                    ID
                  </th>
                  <th className="border-0">
                    Email
                  </th>
                  <th className="border-0">
                    Password
                  </th>
                  <th className="border-0">
                    Display Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>1</td>
                  <td>Ali</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Clark</td>
                </tr> */}
                {users.map(user => (
                    <tr>
                        <td>{user.user_id}</td>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>{user.name}</td>
                    </tr>
                ))}
              </tbody>
            </table>
        </CardBody>
      </Card>
    );
};

export default UserList;