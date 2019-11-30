import React, { Component } from 'react';
import classes from "./Dashboard.module.css";
import TimelineChart from "./TimelineChart";

export default class Dashboard extends Component {
    state = {
        labels     : [],
        data       : [],
        host       : "http://127.0.0.1:5000/data?",
        window_time: 10,
        num_windows: 10,
        end_time   : Date.now() / 1000 | 0,
        isLoaded   : false,
        error      : null
    }

    componentDidMount() {
        const url = new URL(window.location)
        let searchParams = new URLSearchParams()

        searchParams.set('device_uuid', url.searchParams.get('device_uuid'))
        searchParams.set('window_time', url.searchParams.get('window_time') || this.state.window_time)
        searchParams.set('num_windows', url.searchParams.get('num_windows') || this.state.num_windows)
        searchParams.set('end_time'   , url.searchParams.get('end_time')    || this.state.end_time)

        const api_url = this.state.host + searchParams.toString()

        fetch(api_url)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    labels  : result.labels,
                    data    : result.datasets
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
  }

    render() {
        let { labels, data,  isLoaded, error } = this.state;
        const url = new URL(window.location)
        if(!url.searchParams.has('device_uuid')) {
            return <div> Missing parameter "device_uuid"</div>
        } else if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={classes.container}>
                    <TimelineChart
                        data={data}
                        labels={labels} />
                </div>
            )
        }
    }
}