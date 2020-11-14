

import React, {useEffect, useState} from "react";
import { Redirect } from "react-router-dom";
import {
  Card,
  Row, Col,
  CardHeader,
  CardBody,
  Button,
  FormCheckbox,
  CardFooter,
  FormInput
} from "shards-react";


const TakeCareCategory = ({ user }) => {
  if (user == null) return <Redirect to="/login" />;
  if (user.is_full_time == undefined) return <Redirect to="/errors" />;

  const update = () => {

  }
  
  const category = ["Dogs","Cats","Rabbits","Hamsters","Birds"]
  const [data, setData] = useState([])

  useEffect(async () => {
    try {
      const result = await fetch(`/caretakers/${user.user_id}/categories`, {
        method: "GET"
      }).then((response) => {

        return response.json()
      })
      setData(result)

    } catch (error) {
      console.log(error);
    }
  }, []);

  const getPrice = (name) => {
    if (data.length == 0) {
      return 0
    }
    const result = data.filter(x => x.category_name == name)
    return result.length == 1 ? result.daily_price : 0
  }

  const updateName = (name) => {
    if (!containsName(name)) {
      console.log(data)
      setData(data.push([name, 0]))
    } else {
      setData(data.filter(x => x.category_name != name))
    }
  }

  const updatePrice = (name, price) => {

    if (data.length == 0) {
      return false
    }
    if (!containsName(name)) {
      setData(data.push([name, price]))
    } else {
      setData(data.map(x => x.category_name == name ? [name, price] : x))
    }
    console.log(data)
  }

  const containsName = (name) => {
    return data.filter(x => x[0] == name).length > 0;
  }
  console.log("data ", data)

  if (data.length == 0) return null;
  return (
      <Card>
      <CardHeader className="border-bottom">
        <h6 className="m-0">Pet Category Pricing</h6>
      </CardHeader>
      <CardBody>
      <Row form>
        <Col md="3" className="form-group">
          <label htmlFor="feEmail">Category</label>
        </Col>
        <Col md="3" className="form-group">
          <label htmlFor="feEmail">Daily Price</label>
        </Col>
      </Row>
        {
          data.map(item => 
            <Row form >
              <Col md="3" className="form-group">
                <FormInput
                  type="text"
                  key={item.category_name}
                  value={item.category_name}
                  disabled
                />
              </Col>
              <Col md="3" className="form-group">
                <FormInput
                  type="text"
                  key={item.daily_price}
                  value={"$".concat(item.daily_price)}
                  disabled
                />
              </Col>
            </Row>
          )
        }
        {/* <Row form >
          <Col md="3" className="form-group">
            <FormInput
              type="text"
              key={item.category_name}
              value={item.category_name}
              disabled
            />
          </Col>
          <Col md="3" className="form-group">
            <FormInput
              type="text"
              key={item.daily_price}
              value={"$".concat(item.daily_price)}
              disabled
            />
          </Col>
        </Row> */}
      </CardBody>
      <CardFooter className="mb-2">
        {/* <Button className="mr-2" onClick={update}>Update</Button> */}
        </CardFooter>
    </Card>
)};

export default TakeCareCategory;
