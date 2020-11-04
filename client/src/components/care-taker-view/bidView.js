import React, { Component } from "react";
import { Row, Button, Card, CardBody, CardHeader } from "shards-react";
import BidRow from "./bidRow";

export default class BidView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bids: [],
    };
  }

  async getBids(care_id) {
    try {
      const response = await fetch(
        `http://localhost:5000/caretakers/getBidById/${care_id}`
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    this.getBids(this.props.user.user_id).then((res) => {
      this.setState({
        bids: res,
      });
    });
  }

  render() {
    const { bids } = this.state;
    return (
      <Card>
        <CardHeader>Part timer bidding confirmation</CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Pet
                </th>
                <th scope="col" className="border-0">
                  Name
                </th>
                <th scope="col" className="border-0">
                  Owner
                </th>
                <th scope="col" className="border-0">
                  Start date
                </th>
                <th scope="col" className="border-0">
                  End date
                </th>
                <th scope="col" className="border-0">
                  Amount
                </th>
                <th scope="col" className="border-0">
                  Confirm
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((row) => (
                <BidRow row={row} />
              ))}
              {/* <tr>
                <td>Dog</td>
                <td>Sunny</td>
                <td>Jason</td>
                <td>5 Oct 2020</td>
                <td>10 Oct 2020</td>
                <td>S$100</td>
                <td>
                  <Button>Confirm</Button>
                </td>
              </tr> */}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}
