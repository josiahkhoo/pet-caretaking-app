import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  Alert,
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Colors from "../components/components-overview/Colors";
import Checkboxes from "../components/components-overview/Checkboxes";
import RadioButtons from "../components/components-overview/RadioButtons";
import ToggleButtons from "../components/components-overview/ToggleButtons";
import SmallButtons from "../components/components-overview/SmallButtons";
import SmallOutlineButtons from "../components/components-overview/SmallOutlineButtons";
import NormalButtons from "../components/components-overview/NormalButtons";
import NormalOutlineButtons from "../components/components-overview/NormalOutlineButtons";
import Forms from "../components/components-overview/Forms";
import FormValidation from "../components/components-overview/FormValidation";
import CompleteFormExample from "../components/components-overview/CompleteFormExample";
import Sliders from "../components/components-overview/Sliders";
import ProgressBars from "../components/components-overview/ProgressBars";
import ButtonGroups from "../components/components-overview/ButtonGroups";
import InputGroups from "../components/components-overview/InputGroups";
import SeamlessInputGroups from "../components/components-overview/SeamlessInputGroups";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import DropdownInputGroups from "../components/components-overview/DropdownInputGroups";
import CustomSelect from "../components/components-overview/CustomSelect";
import PetOwnerBidTable from "../components/pet-owner-bid-table/PetOwnerBidTable";

export default class PetOwner extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  render() {
    return (
      <div>
        <Container fluid className="px-0">
          <Alert className="mb-0">
            <i className="fa fa-info mx-2"></i> How you doin'? I'm just a
            friendly, good-looking notification message and I come in all the
            colors you can see below. Pretty cool, huh?
          </Alert>
        </Container>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle
              sm="4"
              title="Pet Owner"
              subtitle="Overview"
              className="text-sm-left"
            />
          </Row>

          <Colors />

          <Row>
            <Col lg="8" className="mb-4">
              <PetOwnerBidTable />
              <Card small>
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Form Example</h6>
                </CardHeader>
                <CompleteFormExample />
              </Card>
            </Col>

            <Col lg="4" className="mb-4">
              {/* Sliders & Progress Bars */}
              <Card small className="mb-4">
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Sliders & Progress Bars</h6>
                </CardHeader>
                <ListGroup flush>
                  <ProgressBars />
                  <Sliders />
                </ListGroup>
              </Card>

              {/* Groups */}
              <Card small className="mb-4">
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Groups</h6>
                </CardHeader>

                <ListGroup flush>
                  <ListGroupItem className="px-3">
                    <Form>
                      <strong className="text-muted d-block mb-3">
                        Button Groups
                      </strong>
                      <ButtonGroups />

                      <strong className="text-muted d-block mb-2">
                        Input Groups
                      </strong>
                      <InputGroups />

                      <strong className="text-muted d-block mb-2">
                        Seamless Input Groups
                      </strong>
                      <SeamlessInputGroups />
                    </Form>
                  </ListGroupItem>
                </ListGroup>
              </Card>

              <Card small>
                {/* Files & Dropdowns */}
                <CardHeader className="border-bottom">
                  <h6 className="m-0">Files & Dropdowns</h6>
                </CardHeader>

                <ListGroup flush>
                  <ListGroupItem className="px-3">
                    <strong className="text-muted d-block mb-2">
                      Custom File Upload
                    </strong>
                    <CustomFileUpload />

                    <strong className="text-muted d-block mb-2">
                      Dropdown Input Groups
                    </strong>
                    <DropdownInputGroups />

                    <strong className="text-muted d-block mb-2">
                      Custom Select
                    </strong>
                    <CustomSelect />
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
