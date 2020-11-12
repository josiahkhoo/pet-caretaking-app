import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, CardBody, number } from "shards-react";
import moment from "moment";
import priceToString from "../../utils/priceToString";

export default class SalaryCard extends Component {
  static propTypes = {
    careTakerUserId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      salary: 0,
      numberPetDays: 0,
    };
  }

  async getSalary() {
    const { careTakerUserId } = this.props;
    const startOfMonth = moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment()
      .endOf("month")
      .format("YYYY-MM-DD");
    try {
      const res = await fetch(
        `/caretakers/${careTakerUserId}/salary/${startOfMonth}/${endOfMonth}`
      );
      return res.json();
    } catch (error) {
      return null;
    }
  }

  componentDidMount() {
    const { salary, numberPetDays } = this.state;
    this.getSalary().then((res) => {
      if (typeof res === "object" && res !== null) {
        console.log(res);
        if (
          res.salary !== salary &&
          res.salary !== null &&
          res.salary !== undefined
        ) {
          this.setState({
            salary: res.salary,
          });
        }
        if (
          res.pet_day !== numberPetDays &&
          res.pet_day !== null &&
          res.pet_day !== undefined
        ) {
          this.setState({
            numberPetDays: res.pet_day,
          });
        }
      }
    });
  }

  render() {
    const { salary, numberPetDays } = this.state;
    return (
      <Card>
        <CardBody>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5>Salary for this month</h5>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5>{priceToString(salary)}</h5>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5>Number of pet days this month</h5>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5>{numberPetDays}</h5>
          </div>
        </CardBody>
      </Card>
    );
  }
}
