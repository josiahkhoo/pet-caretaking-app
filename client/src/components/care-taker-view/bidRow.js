import React, { Component } from "react";
import { Button } from "shards-react";
import moment from "moment";
import priceToString from "../../utils/priceToString";
import Category from "../user-profile-lite/Category";

export default class BidRow extends Component {
  async confirmBid(
    careTakerUserId,
    startDate,
    endDate,
    petOwnerUserId,
    petName
  ) {
    const body = {
      care_taker_user_id: careTakerUserId,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      pet_owner_user_id: petOwnerUserId,
      pet_name: petName,
    };
    try {
      const response = await fetch(`/caretakers/part-time/bid/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { row } = this.props;
    return (
      <tr key={row}>
        <td>{<Category name={row.category_name} />}</td>
        <td>{row.pet_name}</td>
        <td>{row.name}</td>
        <td>{moment(row.start_date).format("YYYY-MM-DD")}</td>
        <td>{moment(row.end_date).format("YYYY-MM-DD")}</td>
        <td>{priceToString(row.total_price)}</td>
        <td>
          <Button
            onClick={() =>
              this.confirmBid(
                row.care_taker_user_id,
                row.start_date,
                row.end_date,
                row.pet_owner_user_id,
                row.pet_name
              ).then(() => this.props.update())
            }
          >
            Confirm
          </Button>
        </td>
        <td></td>
      </tr>
    );
  }
}
