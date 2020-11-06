

import React, {useState} from "react";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Form,
  FormGroup
} from "shards-react";

import moment from "moment";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
const ViewAvailability = ({ user }) => {
  const localizer = momentLocalizer(moment)

  const myEventsList = [
    {
      start: moment().toDate(),
      end: moment()
        .add(1, "days")
        .toDate(),
      title: "Some title"
    },
    {
      start: moment().toDate(),
      end: moment()
        .add(5, "days")
        .toDate(),
      title: "Some title2"
    }

  ]

  return (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <div className="mb-3 mx-auto">
        <img
          className="rounded-circle"
          width="110"
        />
      </div>
      <h2 className="mb-0">{user.is_full_time ? "On Leave Dates" : "Available Dates"}</h2>

    </CardHeader>
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
    <CardBody>
    <Form className="create-new-bid">
      <FormGroup>
      </FormGroup>
      </Form>
    </CardBody>
  </Card>
)};

export default ViewAvailability;
