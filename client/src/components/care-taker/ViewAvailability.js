

import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup
} from "shards-react";

import moment from "moment";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
const ViewAvailability = ({ user }) => {
  const localizer = momentLocalizer(moment)

  const [availableDates, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);


  useEffect(async () => {
    try {
      const result = await fetch(`/caretakers/availability/user/${user.user_id}`, {
        method: "GET"
      }).then((response) => {
        return response.json()
      })
      setData(result)
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const myEventsList = availableDates.map(date => ({ start: moment(date.available_date).toDate(), end: moment(date.available_date).add(1, "days").toDate(), title: "Available" }));

  if (isLoading) return null;

  return (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <div className="mb-3 mx-auto">
        <img
          className="rounded-circle"
          width="110"
        />
      </div>
      <h2 className="mb-0">Available Dates</h2>

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
