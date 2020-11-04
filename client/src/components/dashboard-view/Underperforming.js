import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Row,
} from "shards-react";
import MonthDropdown from "./MonthDropdown";
import monthName from "../../utils/monthName";
import YearDropdown from "./YearDropdown";


export default class Underperforming extends Component {
    static propTypes = {
        month: PropTypes.number,
    };
    
    currDate = new Date();

    constructor(props) {
        super(props);
        this.state = {
            month: this.currDate.getMonth(),
            year: this.currDate.getFullYear(),
            underperformers: [],
        };
    }
    
    onChangeMonth(month) {
      if (this.state.year != null) {
        this.getUnderperformers(month, this.state.year).then((res) => {
            this.setState({
                month: month,
                underperformers: res,
            });
        });
      } else {
        this.setState({
          month: month
        });
      }
    }

    onChangeYear(year) {
      if (this.state.month != null) {
        this.getUnderperformers(this.state.month, year).then((res) => {
          this.setState({
              year: year,
              underperformers: res,
          });
        });
      } else {
        this.setState({
          year: year
        });
      }
    }

    async getUnderperformers(month, year) {
        try {
        const response = await fetch(
            `http://localhost:5000/caretakers/under-performing/${month}/${year}`,
        );
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
    }
  }

    componentDidMount() {
      this.getUnderperformers(this.state.month, this.state.year).then((res) => {
        this.setState({
          underperformers : res,
        })
      });
    }

  render() {
    const { month, year, underperformers } = this.state;
    return (
        <Card>
        <CardHeader><h5>Underperforming Full-Time Caretakers in {monthName(month)} {year}</h5></CardHeader>
        <CardBody>
        <Form>
            <FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexFlow: "row",
                }}
              >
                <MonthDropdown
                  month={month}
                  onChangeMonth={(month) => this.onChangeMonth(month)}
                />
              <div style={{ marginRight: "1em" }} />
                <YearDropdown 
                  year={year}
                  onChangeYear={(year) => this.onChangeYear(year)}
                />
              </div>
            </FormGroup>
        </Form>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Caretaker ID
                </th>
                <th scope="col" className="border-0">
                  Caretaker Name
                </th>
              </tr>
            </thead>
            <tbody>
                {underperformers.map((id) =>(
                <tr key = {id}>
                    <td>
                        {id.user_id}
                    </td>
                    <td>
                        {id.name}
                    </td>
                </tr>
                ))}
            </tbody>
          </table>
        </CardBody>
        </Card>
    );
  }
}
