import React, { Component } from "react";
import { Row, Col, Button, Card, CardBody, CardHeader } from "shards-react";
import BidRow from "./bidRow";
import ConfirmedBidRow from "./confirmBidRow";

export default class BidView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bids: [],
      confirmedBids: [],
    };
  }

  async getBids(care_id) {
    try {
      const response = await fetch(`/caretakers/getBidById/${care_id}`);
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getConfirmedBids(care_id) {
    try {
      const response = await fetch(
        `/caretakers/getConfirmedBidById/${care_id}`
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
    this.getConfirmedBids(this.props.user.user_id).then((res) => {
      this.setState({
        confirmedBids: res,
      });
    });
  }

  update() {
    this.getBids(this.props.user.user_id).then((res) => {
      this.setState({
        bids: res,
      });
    });
    this.getConfirmedBids(this.props.user.user_id).then((res) => {
      this.setState({
        confirmedBids: res,
      });
    });
  }

  isPartTimer() {
    return !this.props.user.is_full_time;
  }

  render() {
    const { bids, confirmedBids } = this.state;
    return (
      <div>
        {this.isPartTimer() ? (
          <Row>
            <Col className="mb-4">
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
                        <BidRow row={row} update={() => this.update()} />
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <div></div>
        )}

        <Row>
          <Col className="mb-4">
            <Card>
              <CardHeader>Confirmed bids</CardHeader>
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
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedBids.map((row) => (
                      <ConfirmedBidRow row={row} />
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
