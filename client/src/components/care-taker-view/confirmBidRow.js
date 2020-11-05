import React, { Component } from "react";
import { Button } from "shards-react";
import moment from "moment";

export default class ConfirmedBidRow extends Component {
  render() {
    const { row } = this.props;
    return (
      <tr key={row}>
        <td>{row.category_name}</td>
        <td>{row.pet_name}</td>
        <td>{row.name}</td>
        <td>{moment(row.start_date).format("YYYY-MM-DD")}</td>
        <td>{moment(row.end_date).format("YYYY-MM-DD")}</td>
        <td>{row.total_price}</td>
        <td></td>
      </tr>
    );
  }
}
