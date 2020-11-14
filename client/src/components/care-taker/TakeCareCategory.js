

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
  const [dog, setDog] = useState([])
  const [cat, setCat] = useState([])

  useEffect(async () => {
    try {
      const result = await fetch(`/caretakers/${user.user_id}/categories`, {
        method: "GET"
      }).then((response) => {

        return response.json()
      })
      setData(result.map(item => [item.category_name, item.daily_price])).then(() =>
        {
          setDog(data.filter(item => item[0] == category[0]));
          setCat(data.filter(item => item[0] == category[1]));
        }
      )

    } catch (error) {
      console.log(error);
    }
  }, []);

  const getPrice = (name) => {
    if (data.length == 0) {
      return 0
    }
    const result = data.filter(x => x[0] == name)
    console.log(name, result[1], result.length)
    return result.length == 1 ? result[1] : 0
  }

  const updateName = (name) => {
    if (!containsName(name)) {
      console.log(data)
      setData(data.push([name, 0]))
    } else {
      setData(data.filter(x => x[0] != name))
    }
  }

  const updatePrice = (name, price) => {

    if (data.length == 0) {
      return false
    }
    if (!containsName(name)) {
      setData(data.push([name, price]))
    } else {
      setData(data.map(x => x[0] == name ? [name, price] : x))
    }
    console.log(data)
  }

  const containsName = (name) => {
    return data.filter(x => x[0] == name).length > 0;
  }
  console.log(dog)
  console.log("data ", data)


  if (data == []) return null;
  return (
      <Card>
      <CardHeader className="border-bottom">
        <h6 className="m-0">Pet Categories To Take Care</h6>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg="2">
            <FormCheckbox
              className="mt-2"
              defaultChecked={dog.length != 0}
              name="a"
              value={category[0]}
              onChange={(e) => {
                if (dog != []) {
                  setDog([])
                } else {
                  setDog([category[0], 0])
                }
                console.log(dog)
                console.log(data)
              }}
            >
              {category[0]}
            </FormCheckbox>
          </Col>
          <Col lg="3">
            <FormInput
              name="a"
              value={getPrice(category[0])}
              disabled={dog.length == 0}
              type="number"
              maxLength="8"
              onChange={(e) => {
                console.log(dog)
                console.log(data)
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col lg="2">
            <FormCheckbox
              className="mt-2"
              name="a"
              value={category[1]}
              defaultChecked={cat.length != 0}
              onChange={(e) => {
                updateName(e.target.value)
                console.log(data)
              }}
            >
              {category[1]}
            </FormCheckbox>
          </Col>
          <Col lg="3">
            <FormInput
              name={category[1]}
              value={getPrice(category[1])}
              disabled={!containsName(category[1])}
              type="number"
              maxLength="8"
              onChange={(e) => updatePrice(e.target.name, parseFloat(e.target.value))}
            />
          </Col>
        </Row>

        <Row>
          <Col lg="2">
            <FormCheckbox
              className="mt-2"
              name={category[2]}
              value={category[2]}
              onChange={(e) => {
                updateName(e.target.value)
                console.log(data)
              }}
            >
              {category[2]}
            </FormCheckbox>
          </Col>
          <Col lg="3">
            <FormInput
              name={category[2]}
              value={getPrice(category[2])}
              disabled={!containsName(category[2])}
              type="number"
              maxLength="8"
              onChange={(e) => updatePrice(e.target.name, parseFloat(e.target.value))}
            />
          </Col>
        </Row>

      </CardBody>
      <CardFooter className="mb-5">
        <Button className="mr-2" onClick={update}>Update</Button>
        </CardFooter>
    </Card>
)};

export default TakeCareCategory;
