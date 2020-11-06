import React, { Component } from "react";
import priceToString from "../../utils/priceToString";

export default class SalaryRow extends Component {
  render() {
    const { row } = this.props;
    return (
      <tr key={row}>
        <td>{row.care_taker_user_id}</td>
        <td>{row.pet_day}</td>
        <td>{priceToString(row.total_earnings)}</td>
        <td>
          {row.post_60_days_earnings == null
            ? 0
            : priceToString(row.post_60_days_earnings)}
        </td>
        <td>{row.is_full_time ? "Yes" : "No"}</td>
        <td>{priceToString(row.salary)}</td>
      </tr>
    );
  }
}
