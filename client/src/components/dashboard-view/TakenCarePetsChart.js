import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import RangeDatePicker from "../common/RangeDatePicker";
import Chart from "../../utils/chart";

class TakenCarePetsChart extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const chartOptions = {
      ...{
        responsive: true,
        legend: {
          position: "top"
        },
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3
          },
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              ticks: {
                callback(tick, index) {
                  // Jump every 7 values on the X axis labels to avoid clutter.
                  return index % 7 !== 0 ? "" : tick;
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 45,
                callback(tick) {
                  if (tick === 0) {
                    return tick;
                  }
                  // Format the amounts using Ks for thousands.
                  return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                }
              }
            }
          ]
        },
        hover: {
          mode: "nearest",
          intersect: false
        },
        tooltips: {
          custom: false,
          mode: "nearest",
          intersect: false
        }
      },
      ...this.props.chartOptions
    };

    const PetsOverview = new Chart(this.canvasRef.current, {
      type: "LineWithLine",
      data: this.props.chartData,
      options: chartOptions
    });

    // They can still be triggered on hover.
    const petMeta = PetsOverview.getDatasetMeta(0);
    petMeta.data[0]._model.radius = 0;
    petMeta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0;

    // Render the chart.
    PetsOverview.render();
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Row className="border-bottom py-2 bg-light">
            <Col sm="6" className="d-flex mb-2 mb-sm-0">
              <RangeDatePicker />
            </Col>
            <Col>
              <Button
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                View Full Report &rarr;
              </Button>
            </Col>
          </Row>
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
          />
        </CardBody>
      </Card>
    );
  }
}

TakenCarePetsChart.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
};

TakenCarePetsChart.defaultProps = {
  title: "Chart View of number of pets we took care of",
  chartData: {
    labels: ["1 - January", 
             "2 - February",
             "3 - March",
             "4 - April",
             "5 - May",
             "6 - June",
             "7 - July",
             "8 - August",
             "9 - September",
             "10 - October",
             "11 - November",
             "12 - December",
            ],
    datasets: [
      {
        label: "Current Month",
        fill: "start",
        data: [
          0,
          5,
          10,
          12,
          7,
          8,
          13,
          9,
          7,
          22,
          30,
          25
        ],
        backgroundColor: "rgba(0,123,255,0.1)",
        borderColor: "rgba(0,123,255,1)",
        pointBackgroundColor: "#ffffff",
        pointHoverBackgroundColor: "rgb(0,123,255)",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 3
      },
    //   {
    //     label: "Past Month",
    //     fill: "start",
    //     data: [
    //       380,
    //       430,
    //       120,
    //       230,
    //       410,
    //       740,
    //       472,
    //       219,
    //       391,
    //       229,
    //       400,
    //       203,
    //       301,
    //       380,
    //       291,
    //       620,
    //       700,
    //       300,
    //       630,
    //       402,
    //       320,
    //       380,
    //       289,
    //       410,
    //       300,
    //       530,
    //       630,
    //       720,
    //       780,
    //       1200
    //     ],
    //     backgroundColor: "rgba(255,65,105,0.1)",
    //     borderColor: "rgba(255,65,105,1)",
    //     pointBackgroundColor: "#ffffff",
    //     pointHoverBackgroundColor: "rgba(255,65,105,1)",
    //     borderDash: [3, 3],
    //     borderWidth: 1,
    //     pointRadius: 0,
    //     pointHoverRadius: 2,
    //     pointBorderColor: "rgba(255,65,105,1)"
    //   }
    ]
  }
};

export default TakenCarePetsChart;
