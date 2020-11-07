import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
} from "shards-react";
import SalaryRow from "./SalaryRow";
import MonthDropdown from "./MonthDropdown"
import monthName from "./../../utils/monthName"
const moment = require('moment');


export default class TotalSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaries: [],
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().endOf('month').format('YYYY-MM-DD'),
    };
  }

  async getSalaries(start, end) {
    try {
      const response = await fetch(
        `/caretakers/salary/${start}/${end}`,
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  onChangeMonth(month) {
    const start = `2020-${month}-01`
    const end = `2020-${month}-30`
      this.getSalaries(start, end).then((res) => {
          this.setState({
              start : start,
              end: end,
              salaries : res,
          });
      });
  } 



  componentDidMount() {
    this.getSalaries(this.state.start, this.state.end).then((res) => {
      this.setState({
        salaries: res,
      });
    });
  }

  render() {
    const { start, salaries } = this.state;
    const month = moment(start).month() + 1;
    return (
        <Card>
        <CardHeader><h5>Total Salaries for Caretakers in {monthName(month)}</h5></CardHeader>
        <CardBody>
          <MonthDropdown
            month = {month}
            onChangeMonth = {(month) => this.onChangeMonth(month)} 
          />
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
