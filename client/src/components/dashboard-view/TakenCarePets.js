import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "shards-react";
import PetNumRow from "./PetNumRow";

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
        "/caretakers/total-pet-care-by-month",
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
        <CardHeader><h5>Total number of Pets we took care of:</h5></CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Month
                </th>
                <th scope="col" className="border-0">
                  Year
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
