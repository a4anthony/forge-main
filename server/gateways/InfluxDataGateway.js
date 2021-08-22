//
// Copyright 2021 Autodesk
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "()"}]*/
const DataGateway = require("forge-dataviz-iot-data-modules/server/gateways/Hyperion.Server.DataGateway");
const timestring = require("timestring");
const {
    loadJSONFile,
} = require("forge-dataviz-iot-data-modules/server/gateways/FileUtility");
let InfluxDB = require("./influx");
const Q = require("q");

/**
 * @classdesc A data gateway that supplies CSV data from local
 * @class
 * @augments DataGateway
 * @memberof Autodesk.DataVisualization.Data
 * @alias Autodesk.DataVisualization.Data.InfluxDataGateway
 */
class InfluxDataGateway extends DataGateway {
    /**
     *
     * @param {string} deviceModelFile JSON file, please refer to https://github.com/Autodesk-Forge/forge-dataviz-iot-reference-app/blob/main/server/gateways/synthetic-data/device-models.json
     * @param {string} deviceFile JSON file, please refer to https://github.com/Autodesk-Forge/forge-dataviz-iot-reference-app/blob/main/server/gateways/synthetic-data/devices.json
     * @param dataFolder
     * @param options
     * @param dataFileExtension
     */
    constructor(
        deviceModelFile,
        deviceFile,
    ) {
        super("LocalGateway");
        this.deviceModelFile = deviceModelFile;
        this.deviceFile = deviceFile;
    }
    async getDeviceModels() {
        return loadJSONFile(this.deviceModelFile);
    }
    async getDevicesInModel(deviceModelId) {
        let devices = await loadJSONFile(this.deviceFile);
        return devices.find((device) => device.deviceModelId === deviceModelId);
    }
    async getAggregates(
        deviceId,
        propertyId,
        startSecond,
        endSecond,
        resolutionStr
    ) {
        let defer = Q.defer();
        let resolution = timestring(resolutionStr.replace(/PT/gi, ""));



        let start = startSecond - resolution / 2;
        let end = endSecond + resolution / 2;

        console.log("resolution, start, end, startSecond,endSecond", resolution, start, end, startSecond, endSecond);


        const database = new InfluxDB();
        database.GetMeasurement(deviceId, propertyId.toLowerCase());

        sleep(500).then(() => { functionForge(database.GetResult()); });


        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function functionForge(ìnfluxResults) {
            // console.log(results);
            let results = [];
            let min = [];
            let max = [];
            let counts = [];

            ìnfluxResults.then(res => {
                let resFiltered = res.filter(x => x.time && x.mean)
                // defer.reject(resFiltered)

                resFiltered.forEach(result => {
                            const time = Math.round((new Date(new Date(result.time).toISOString()).getTime() / 1000))
                            //console.log(start,time,end)
                            //console.log(new Date(start*1000),new Date(time*1000),new Date(end*1000))
                            if (time >= start && time <= end) {
                                console.log('main')
                                let value = parseFloat(result.mean);
                                let index = Math.round((time - start) / resolution);

                                if (results[index]) {
                                    let [sum, count] = results[index];
                                    results[index] = [sum + value, count + 1];

                                    min[index] = Math.min(min[index], value);
                                    max[index] = Math.max(max[index], value);
                                    counts[index] = count;
                                } else {
                                    results[index] = [value, 1];

                                    min[index] = value;
                                    max[index] = value;
                                    counts[index] = index;
                                }
                            }

                    })
                
                let aggregate = [];
                let timestamps = [];
                let sums = [];

                for (let i = 0; i < results.length; i++) {
                    timestamps[i] = startSecond + resolution * i;
                    if (results[i]) {
                        let [sum, count] = results[i];
                        aggregate[i] = sum / count;
                        sums[i] = sum;
                    } else {
                        aggregate[i] = null;
                    }
                }

                //  console.log({
                //      timestamps,
                //      min,
                //      max,
                //      count: counts,
                //      sum: sums,
                //      avg: aggregate,
                //    }) 

                defer.resolve({
                    timestamps,
                    min,
                    max,
                    count: counts,
                    sum: sums,
                    avg: aggregate,
                });
            })

        }
        return defer.promise;

    }
}
module.exports = InfluxDataGateway;