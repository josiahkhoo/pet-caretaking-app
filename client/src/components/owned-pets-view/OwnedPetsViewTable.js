import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Form,
  FormInput,
  Button,
  ListGroup,
  ListGroupItem,
} from "shards-react";
import { Link } from "react-router-dom";

export default class OwnedPetsViewTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
    };
  }

  async getAllPets(getOwnerUserId) {
    try {
      const response = await fetch(
        `/pet-owners/${getOwnerUserId}/pets-without-userinfo`
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  petToRow(pet) {
    return (
      <tr>
        {/* <td>{pet.owner}</td> */}
        <td>
          <Link
            to={{
              pathname: "pet-profile",
              state: {
                pet: pet,
              },
            }}
          >
            {" "}
            {pet.pet_name}
          </Link>
        </td>
        <td>{pet.category_name}</td>
        <td>{pet.special_requirements}</td>
        {/* <td>{pet.pic}</td> */}
      </tr>
    );
  }

  componentDidMount() {
    this.getAllPets(this.props.petOwnerUserId).then((res) => {
      console.log(res);
      if (Array.isArray(res)) {
        this.setState({
          pets: res,
        });
      }
    });
  }

  render() {
    const { pets } = this.state;
    const { petOwnerUserId } = this.props;

    return (
      <Card>
        <CardHeader className="border-bottom">
          <h6>All Pets</h6>
        </CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                {/* <th scope="col" className="border-0">
                    Pet Owner
                  </th> */}
                <th scope="col" className="border-0">
                  Name
                </th>
                <th scope="col" className="border-0">
                  Category
                </th>
                <th scope="col" className="border-0">
                  Special Requirements
                </th>
                {/* <th scope="col" className="border-0">
                    Picture URL
                  </th> */}
              </tr>
            </thead>
            <tbody>{pets.map((pet) => this.petToRow(pet))}</tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexFlow: "row",
            }}
          >
            <Button
              tag={Link}
              to={{
                pathname: "add-new-pet",
                state: {
                  petOwnerUserId: petOwnerUserId,
                },
              }}
            >
              <i className="material-icons">add</i>Add Pet
            </Button>
            <div style={{ marginRight: "1em" }} />
            <Button
              tag={Link}
              to={{
                pathname: "create-bid",
                state: {
                  petOwnerUserId: petOwnerUserId,
                },
              }}
            >
              <i className="material-icons">add</i>Create Bid
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
}
