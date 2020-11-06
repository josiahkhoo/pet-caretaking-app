

import React, {useState} from "react";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  CardBody,
  Form,
  FormGroup
} from "shards-react";

import moment from "moment";
import RangeDatePicker from "../common/RangeDatePicker";

const AvailabilityForm = ({ user }) => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const submit = () => {
    const now = moment();
    if (startDate > endDate || startDate < now || endDate < now) {
      alert("Invalid date entries");
    }
    const start_date = moment(startDate).format("YYYY-MM-DD");
    const end_date = moment(endDate).format("YYYY-MM-DD");
    console.log(start_date, end_date);
    try {
      const body = { start_date, end_date };
      fetch("/caretakers/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          alert("Success")
        });
    } catch (error) {
      console.log(error)
      alert("An error has occurred")
    }
  }

  return (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <div className="mb-3 mx-auto">
        <img
          className="rounded-circle"
          width="110"
        />
      </div>
      <h2 className="mb-0">{user.is_full_time ? "Take Leave" : "Specify Available Dates"}</h2>

    </CardHeader>
    <CardBody>
    <Form className="create-new-bid">
      <FormGroup>
        <h6>Date Period</h6>
        <RangeDatePicker
          startDate={startDate}
          endDate={endDate}
          handleStartDateChange={(date) => setStartDate(date)}
          handleEndDateChange={(date) => setEndDate(date)}
        />
      </FormGroup>
      </Form>
    <Button onClick={submit}>Submit</Button>
    </CardBody>
  </Card>
)};

export default AvailabilityForm;
