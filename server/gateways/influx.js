const Influx = require('influx');

class InfluxDB {
    constructor() {
        this.influx = new Influx.InfluxDB({
            host: "10.30.104.50",
            database: "sincro"
        });

        this.pointsBuffer = [];
        this.BufferSize = 1000;
        this.BufferInProgress = false;

        this.result = [];
    }

    Start(callback) {
        this.influx.getDatabaseNames().then(names => {
            if (!names.includes("sincro")) {
                return global.NodeQuant.MarketDataDBClient.influx.createDatabase("sincro");
            }
        }).then(() => {
            // callback();
        }).catch(err => {
            console.error(`Error createDatabase to InfluxDB! ${err.stack}`)
        });
    }

    GetMeasurement(sensor_name, sensor_value) {
        // sensor_name = 'I39012-BAT10-' + sensor_name;
        console.log(sensor_name);

        let influxQL = `select mean(value) from ` + sensor_value + `
                where device_name = '` + sensor_name + `'
                and time > now() - 7d
                group by time(10m)
                fill(linear)`;

        let test = this.influx.query(influxQL).then(Result => {
            if (Result.length > 0) {
                this.WriteResult(Result);
            } else {
                console.log("No data recieved!", sensor_name, sensor_value);
                this.result = [];
            }
        }).catch(err => {
            console.log("Error: in getting data from " + sensor_name);
            console.log(err);

            this.result = [];
        });

        // let res = await test;
        // return res
    }

    async GetResult() {
        return this.result;
    }

    WriteResult(res) {
        this.result = res;
        return this.result;
    }

};

function print1(toprint) {
    console.log(toprint);
}

module.exports = InfluxDB;
