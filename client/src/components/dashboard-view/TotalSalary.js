import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "shards-react";
import SalaryRow from "./SalaryRow";


export default class TotalSalary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      salaries: [],
    };
  }

  async getSalaries() {
    try {
      const response = await fetch(
        "http://localhost:5000/caretakers/salary",
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    this.getSalaries().then((res) => {
      this.setState({
        salaries: res.rows,
      });
    });
  }

  render() {
    const { salaries } = this.state;
    return (
        <Card>
        <CardHeader><h5>Total Salaries for Caretakers</h5></CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Caretaker ID
                </th>
                <th scope="col" className="border-0">
                  Pet Days
                </th>
                <th scope="col" className="border-0">
                  Total Earnings
                </th>
                <th scope="col" className="border-0">
                  Post 60 Pet Days Earnings
                </th>
                <th scope="col" className="border-0">
                  Is Full Time?
                </th>
                <th scope="col" className="border-0">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((row) => (
                <SalaryRow row={row} />
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}
