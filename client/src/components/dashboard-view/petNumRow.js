import React, { Component } from "react";
import monthName from "../../utils/monthName"

export default class PetNumRow extends Component {
  render() {
    const { row } = this.props;
    return (
      <tr key={row}>
        <td>{monthName(row.month)}</td>
        <td>{row.year}</td>
        <td>{row.count}</td>
      </tr>
    );
  }
}
