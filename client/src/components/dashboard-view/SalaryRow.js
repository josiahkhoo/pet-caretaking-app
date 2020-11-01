import React, { Component } from "react";

export default class SalaryRow extends Component {
  render() {
    const { row } = this.props;
    return (
      <tr key={row}>
        <td>{row.care_taker_user_id}</td>
        <td>{row.pet_day}</td>
        <td>{Number(row.total_earnings).toFixed(2)}</td>
        <td>{row.post_60_days_earnings == null ? 0 : Number(row.post_60_days_earnings).toFixed(2)}</td>
        <td>{row.is_full_time ? "Yes" : "No"}</td>
        <td>{Number(row.salary).toFixed(2)}</td>
      </tr>
    );
  }
}
