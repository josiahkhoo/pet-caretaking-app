import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
} from "shards-react";
import MonthDropdown from "./MonthDropdown";
import monthName from "../../utils/monthName";


export default class Underperforming extends Component {
    static propTypes = {
        month: PropTypes.number,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            month: null,
            underperformers: [],
        };
    }
    
    onChangeMonth(month) {
        this.getUnderperformers(month).then((res) => {
            this.setState({
                month: month,
                underperformers: res,
            });
        });
    }

    async getUnderperformers(month) {
        try {
        const response = await fetch(
            `http://localhost:5000/caretakers/under-performing/${month}`,
        );
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
    }
  }

  render() {
    const { month, underperformers } = this.state;
    return (
        <Card>
        <CardHeader><h5>Underperforming Full-Time Caretakers in {monthName(month)}</h5></CardHeader>
        <CardBody>
        <Form>
            <FormGroup>
              <h6>Month</h6>
              <MonthDropdown
                month={month}
                onChangeMonth={(rating) => this.onChangeMonth(rating)}
              />
            </FormGroup>
        </Form>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Underperforming Caretaker ID
                </th>
              </tr>
            </thead>
            <tbody>
                {underperformers.map((id) =>(
                <tr key = {id}>
                    <td>
                        {id.underperforming}
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
