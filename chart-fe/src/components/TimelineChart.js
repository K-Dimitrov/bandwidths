import React, { Component } from 'react'
import Chart from "chart.js";
import classes from "./TimelineChart.module.css";

export default class TimelineChart extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data, labels } = this.props;

        new Chart(myChartRef, {
            type: "line",
            data: {
                labels: labels,
                datasets: data
            },
            options: {
                //chart options
            }
        });
    }
    render() {
        return (
            <div className={classes.graphContainer}>
                <canvas
                    id="TimelineChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}