import React, { Component } from "react";
import { Card, CardBody, CardHeader } from "shards-react";
import BidRow from "./BidRow";

export default class PetOwnerBidTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bids: [],
    };
  }

  async getAllBids(petOwnerUserId) {
    try {
      const response = await fetch(
        `http://localhost:5000/pet-owners/${petOwnerUserId}/bid`
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    // TODO: Retrieve pet owner UID from storage
    this.getAllBids(1).then((res) => {
      this.setState({
        bids: res,
      });
    });
  }

  render() {
    const { bids } = this.state;
    return (
      <Card>
        <CardHeader>All bids from pet owner</CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Caretaker UID
                </th>
                <th scope="col" className="border-0">
                  PetOwner UID
                </th>
                <th scope="col" className="border-0">
                  Pet Name
                </th>
                <th scope="col" className="border-0">
                  Is Success
                </th>
                <th scope="col" className="border-0">
                  Payment Type
                </th>
                <th scope="col" className="border-0">
                  Transfer Type
                </th>
                <th scope="col" className="border-0">
                  Total Price
                </th>
                <th scope="col" className="border-0">
                  Review
                </th>
                <th scope="col" className="border-0">
                  Rating
                </th>
                <th scope="col" className="border-0">
                  Start Date
                </th>
                <th scope="col" className="border-0">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <BidRow bid={bid} />
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}