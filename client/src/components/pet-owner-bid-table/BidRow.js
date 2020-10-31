import React, { Component } from "react";
import priceToString from "../../utils/priceToString";
import { Link } from "react-router-dom";
import { Button, Row } from "shards-react";
import moment from "moment";

export default class BidRow extends Component {
  canCreateReview() {
    if (this.props.bid === null) {
      return false;
    }
    console.log(this.props.bid);
    return this.props.bid.is_success === true && this.props.bid.review === null;
  }

  canDeleteBid() {
    if (this.props.bid === null) {
      return false;
    }
    return !this.props.bid.is_success;
  }
  createReview() {}
  render() {
    const { bid } = this.props;
    return (
      <tr key={bid}>
        <td>{bid.care_taker_user_id}</td>
        <td>{bid.pet_owner_user_id}</td>
        <td>{bid.pet_name}</td>
        <td>{bid.is_success.toString()}</td>
        <td>{bid.payment_type}</td>
        <td>{bid.transfer_type}</td>
        <td>{priceToString(bid.total_price)}</td>
        <td>{bid.review}</td>
        <td>{bid.rating}</td>
        <td>{bid.start_date}</td>
        <td>{bid.end_date}</td>
        <td>
          {this.canCreateReview() ? (
            <Button
              tag={Link}
              to={{
                pathname: "create-review",
                state: {
                  bid: bid,
                },
              }}
            >
              Create Review
            </Button>
          ) : (
            <Button outline disabled theme="secondary">
              Create Review
            </Button>
          )}
        </td>
        <td>
          {this.canDeleteBid() ? (
            <Button theme="danger">Delete</Button>
          ) : (
            <Button outline disabled theme="secondary">
              Delete
            </Button>
          )}
        </td>
      </tr>
    );
  }
}
