import React, { Component } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Form,
    FormInput,
    Button,
  } from "shards-react";

export default class OwnedPetsViewTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pets: []
        };
    }

    async getAllPets(getOwnerUserId) {
        try {
            const response = await fetch(`http://localhost:5000/pet-owners/${getOwnerUserId}/pets`);
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    petToRow(pet) {
        return (
            <tr>
                <td>{pet.owner}</td>
                <td>{pet.pname}</td>
                <td>{pet.bio}</td>
                <td>{pet.pic}</td>
            </tr>
        )
    }

    componentDidMount() {
        this.getAllPets(1).then((res) => {
            console.log(res)
            this.setState({
                pets: res,
            });
        })
    }

    render() {
         const {pets } = this.state;

        return (
            <Card>
                <CardHeader>All pets of pet owner</CardHeader>
                <CardBody>
                <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    Pet Owner
                  </th>
                  <th scope="col" className="border-0">
                    Pet Name
                  </th>
                  <th scope="col" className="border-0">
                    Pet Bio
                  </th>
                  <th scope="col" className="border-0">
                    Picture URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => this.petToRow(pet))}
              </tbody>
            </table>
                </CardBody>
            </Card>
        )
    }
}
