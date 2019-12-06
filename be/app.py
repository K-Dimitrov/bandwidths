import json
import numpy
import time
import pandas
from flask import Flask, jsonify, request
app = Flask(__name__)

from bandwidths import BANDWIDTHS
from devices import DEVICES

df = pandas.DataFrame(BANDWIDTHS)


@app.route('/')
def no_such_route():
    return '<h1>404.</h1>'

@app.route('/devices')
def get_devices():
    # return json.dumps(DEVICES).encode()

    response = jsonify(DEVICES)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/data')
def show_users():
    # get the query string params
    device_uuid = request.args.get('device_uuid', type=str)
    end_time    = request.args.get('end_time'   , type=int, default=int(time.time()))
    window_time = request.args.get('window_time', type=int, default=10)
    num_windows = request.args.get('num_windows', type=int, default=10)

    # filter out by device id
    subset = df[df['device_id'] == device_uuid]

    # create time ranges
    ranges = numpy.arange(end_time - window_time * (num_windows + 1), end_time, window_time)

    # group by timestamp and aggregate the value fields
    grouped = subset.groupby(pandas.cut(subset.timestamp, ranges)).agg(
        bytes_ts=('bytes_ts', 'sum'),
        bytes_fs=('bytes_fs', 'sum'),
    )

    # convert to dict by index
    by_index = grouped.to_dict(orient="index")

    # format the result the way charts.js expects it
    result = {
        "labels": [],
        "datasets": [
            {
                "label": "bytes_fs",
                "data": []
            },{
                "label": "bytes_ts",
                "data": []
            }
        ]
    }

    # fill in the data
    for key, row in by_index.items():
        result['labels'].append(str(key.right))
        result['datasets'][0]['data'].append(row['bytes_fs'])
        result['datasets'][1]['data'].append(row['bytes_ts'])

    # avoid CORS issues
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response