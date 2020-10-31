import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  FormInput,
  Row,
  Button,
} from "shards-react";
import PetNumRow from "./petNumRow";


export default class TakenCarePets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      petNum: [],
    };
  }

  async getPetNum() {
    try {
      const response = await fetch(
        "http://localhost:5000/caretakers/total-pet-care-by-month",
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    this.getPetNum().then((res) => {
      this.setState({
        petNum: res,
      });
    });
  }

  render() {
    const { petNum } = this.state;
    return (
        <Card>
        <CardHeader>Total number of Pets we took care of:</CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Month
                </th>
                <th scope="col" className="border-0">
                  No. of Pets
                </th>
              </tr>
            </thead>
            <tbody>
              {petNum.map((row) => (
                <PetNumRow row={row} />
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}
