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


export default class AverageSatisfaction extends Component {
    static propTypes = {
        month: PropTypes.number,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            month: null,
            satisfaction: [],
        };
    }
    
    onChangeMonth(month) {
        this.getSatisfaction(month).then((res) => {
            this.setState({
                month: month,
                satisfaction: res,
            });
        });
    }

    async getSatisfaction(month) {
        try {
        const response = await fetch(
            `http://localhost:5000/caretakers/categories/satisfaction/${month}`,
        );
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
    }
  }

  render() {
    const { month, satisfaction } = this.state;
    return (
        <Card>
        <CardHeader><h5>Average satisfaction rate for all pet categories in {monthName(month)}</h5></CardHeader>
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
                  Pet Category
                </th>
                <th scope="col" className="border-0">
                  Average Satisfaction
                </th>
              </tr>
            </thead>
            <tbody>
                {satisfaction.map((id) =>(
                <tr key = {id}>
                    <td>
                        {id.category_name}
                    </td>
                    <td>
                        {(id.satisfaction) == null ? "N.A." : Number(id.satisfaction).toFixed(2)}
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
