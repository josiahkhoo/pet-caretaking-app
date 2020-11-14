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
      const response = await fetch(`/pet-owners/${petOwnerUserId}/bid`);
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    // TODO: Retrieve pet owner UID from storage
    this.getAllBids(this.props.petOwnerUserId).then((res) => {
      if (Array.isArray(res)) {
        this.setState({
          bids: res,
        });
      }
    });
  }

  update() {
    this.getAllBids(this.props.petOwnerUserId).then((res) => {
      if (Array.isArray(res)) {
        this.setState({
          bids: res,
        });
      }
    });
  }

  render() {
    const { bids } = this.state;
    return (
      <Card>
        <CardHeader className="border-bottom">
          <h6>All Bids</h6>
        </CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Caretaker Name
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
                <BidRow bid={bid} onUpdate={() => this.update()} />
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}
