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

  async deleteBid() {
    const { bid } = this.props;
    try {
      const response = await fetch(`/pet-owners/bid`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          care_taker_user_id: bid.care_taker_user_id,
          pet_name: bid.pet_name,
          pet_owner_user_id: bid.pet_owner_user_id,
          start_date: moment(bid.start_date).format("YYYY-MM-DD"),
          end_date: moment(bid.end_date).format("YYYY-MM-DD"),
        }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  render() {
    const { bid } = this.props;
    console.log(bid);
    return (
      <tr key={bid}>
        <td>
          <Link
            to={{
              pathname: `user/${bid.care_taker_user_id}`,
              state: {
                user: null,
                userId: bid.care_taker_user_id,
              },
            }}
          >
            {bid.care_taker_name}
          </Link>
        </td>
        <td>
          <Link
            to={{
              pathname: "pet-profile",
              state: {
                pet: null,
                petOwnerUserId: bid.pet_owner_user_id,
                petName: bid.pet_name,
              },
            }}
          >
            {bid.pet_name}
          </Link>
        </td>
        <td>{bid.is_success.toString()}</td>
        <td>{bid.payment_type}</td>
        <td>{bid.transfer_type}</td>
        <td>{priceToString(bid.total_price)}</td>
        <td>{bid.review}</td>
        <td>{bid.rating}</td>
        <td>{moment(bid.start_date).format("YYYY-MM-DD")}</td>
        <td>{moment(bid.end_date).format("YYYY-MM-DD")}</td>
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
            <Button
              onClick={() => this.deleteBid().then(() => this.props.onUpdate())}
              theme="danger"
            >
              Delete
            </Button>
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
