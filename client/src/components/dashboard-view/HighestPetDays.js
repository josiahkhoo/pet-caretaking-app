import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "shards-react";
import monthName from "../../utils/monthName";


export default class HighestPetDays extends Component {

  constructor(props) {
    super(props);
    this.state = {
      highestMonth: [],
    };
  }

  async getPetNum() {
    try {
      const response = await fetch(
        "http://localhost:5000/caretakers/highest-pet-care-month",
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    this.getPetNum().then((res) => {
      this.setState({
        highestMonth: res,
      });
    });
  }

  render() {
    const { highestMonth } = this.state;
    return (
        <Card>
        <CardHeader>Current Month with the highest number of jobs</CardHeader>
        <CardBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  Month
                </th>
                <th scope="col" className="border-0">
                  No. of Jobs
                </th>
              </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        {monthName(highestMonth.month)}
                    </td>
                    <td>
                        {highestMonth.petdays}
                    </td>
                </tr>
            </tbody>
          </table>
        </CardBody>
        </Card>
    );
  }
}
