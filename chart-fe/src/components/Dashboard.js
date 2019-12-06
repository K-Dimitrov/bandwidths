import React, { Component } from 'react';
import classes from "./Dashboard.module.css";
import TimelineChart from "./TimelineChart";
import Device from "./Device";

export default class Dashboard extends Component {
    state = {
        labels     : [],
        chart_data       : [],
        host       : "http://127.0.0.1:5000/",
        dataPath   : "data?",
        devicesEndpoint: "devices",
        window_time: 10,
        num_windows: 10,
        end_time   : Date.now() / 1000 | 0,
        isChartLoaded   : false,
        areDevicesLoaded: false,
        error      : null,

        devices_data : []
    }

    componentDidMount() {
        const url = new URL(window.location)
        let searchParams = new URLSearchParams()

        searchParams.set('device_uuid', url.searchParams.get('device_uuid'))
        searchParams.set('window_time', url.searchParams.get('window_time') || this.state.window_time)
        searchParams.set('num_windows', url.searchParams.get('num_windows') || this.state.num_windows)
        searchParams.set('end_time'   , url.searchParams.get('end_time')    || this.state.end_time)

        const api_url = this.state.host + this.state.dataPath + searchParams.toString()

        fetch(api_url)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isChartLoaded: true,
                    labels       : result.labels,
                    chart_data   : result.datasets
                });
            },
            (error) => {
                this.setState({
                    isChartLoaded: true,
                    error
                });
            }
        )

        // let devicesParams = new URLSearchParams()

        const devicesUrl = this.state.host + this.state.devicesEndpoint

        fetch(devicesUrl)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    areDevicesLoaded: true,
                    devices_data : result
                });
            },
            (error) => {
                this.setState({
                    areDevicesLoaded: true,
                    error
                });
            }
        )
  }

    render() {
        let { labels, chart_data,  isChartLoaded, areDevicesLoaded, error, devices_data } = this.state;
        const url = new URL(window.location)
        if(!url.searchParams.has('device_uuid')) {
            return <div> Missing parameter "device_uuid"</div>
        } else if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isChartLoaded ||!areDevicesLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={classes.container}>
                    <ul>
                    {devices_data.map((item) => <Device data={item} />)}
                    </ul>
                    <div >
                    <TimelineChart
                        data={chart_data}
                        labels={labels} />
                    </div>
                </div>
            )
        }
    }
}
