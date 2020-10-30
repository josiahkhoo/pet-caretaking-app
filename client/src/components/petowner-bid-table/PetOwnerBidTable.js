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

export default class PetOwnerBidTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bids: []
        };
    }

    async getAllBids(getOwnerUserId) {
        try {
            const response = await fetch(`http://localhost:5000/pet-owners/${getOwnerUserId}/bid`);
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    bidToRow(bid) {
        return (
            <tr>
                <td>{bid.care_taker_user_id}</td>
                <td>{bid.pet_owner_user_id}</td>
                <td>{bid.pet_name}</td>
                <td>{bid.is_success}</td>
                <td>{bid.payment_type}</td>
                <td>{bid.total_price}</td>
                <td>{bid.review}</td>
                <td>{bid.rating}</td>
                <td>{bid.start_date}</td>
                <td>{bid.end_date}</td>
                <td>{bid.payment_type}</td>
            </tr>
        )
    }

    componentDidMount() {
        this.getAllBids(1).then((res) => {
            console.log(res)
            this.setState({
                bids: res,
            });
        })
    }

    render() {
         const {bids } = this.state;

        return (
            <Card>
                <CardHeader>All bids from pet owner</CardHeader>
                <CardBody>
                <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    CareTaker UserID
                  </th>
                  <th scope="col" className="border-0">
                    Pet Owner UID
                  </th>
                  <th scope="col" className="border-0">
                    Pet Name
                  </th>
                  <th scope="col" className="border-0">
                    Successful
                  </th>
                  <th scope="col" className="border-0">
                    Payment Type
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
                  <th scope="col" className="border-0">
                    Payment Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {bids.map(bid => this.bidToRow(bid))}
              </tbody>
            </table>
                </CardBody>
            </Card>
        )
    }
}
