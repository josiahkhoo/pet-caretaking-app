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
import YearDropdown from "./YearDropdown";

export default class AverageSatisfaction extends Component {
    static propTypes = {
        month: PropTypes.number,
    };
    
    currDate = new Date();

    constructor(props) {
        super(props);
        this.state = {
            month: this.currDate.getMonth(),
            year: this.currDate.getFullYear(),
            satisfaction: [],
        };
    }
    
    onChangeMonth(month) {
      if (this.state.year != null) {
        this.getSatisfaction(month, this.state.year).then((res) => {
            this.setState({
                month: month,
                satisfaction: res,
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
        this.getSatisfaction(this.state.month, year).then((res) => {
          this.setState({
              year: year,
              satisfaction: res,
          });
        });
      } else {
        this.setState({
          year: year
        });
      }
    }

    async getSatisfaction(month, year) {
      try {
      const response = await fetch(
          `/caretakers/categories/satisfaction/${month}/${year}`,
      );
          return await response.json();
      } catch (error) {
          console.log(error);
          return [];
      }
    }

    componentDidMount() {
      this.getSatisfaction(this.state.month, this.state.year).then((res) => {
        this.setState({
          satisfaction : res,
        })
      });
    }

  render() {
    const { month, year, satisfaction } = this.state;
    return (
        <Card>
        <CardHeader><h5>Average satisfaction rate for all pet categories in {monthName(month)} {year}</h5></CardHeader>
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
