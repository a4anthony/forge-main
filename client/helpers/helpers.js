const Q = require("q");

async function generateDevicesFromModel(viewer, model, dataHelper) {

    viewer.getProperties(12538, function(e) {
        // console.log(e)
    })
    var defer = Q.defer();

    let devices = []

    await model.findProperty("SensorName").then(res => {
        model.getBulkProperties(res, ['SensorName', 'dbId', 'externalId', 'temperature', 'pmv', 'ppd', 'tvoc', 'illumination', 'co2', 'Schedule Level', 'name', 'humidity'], function(e) {
            let sensors = e.filter(obj => obj.properties.find(x => x.displayName === 'SensorName' && x.displayValue))
                // console.log(sensors)
            sensors.forEach(sensor => {
                let level = sensor.properties.find(x => x.displayName === 'Schedule Level').displayValue
                if (!devices.find(x => x.id === level)) {
                    let dbIds = [];
                    const types = ['temperature', 'tvoc', 'illumination', 'co2', 'humidity', 'pmv', 'ppd']
                    let levelSensors = []
                    sensors.filter(obj => obj.properties.find(x => x.displayName === 'Schedule Level' && x.displayValue === level)).forEach(sensor => {
                        dbIds.push(sensor.dbId)
                        let sensorTypes = [];
                        sensor.properties.filter(x => types.includes(x.displayName) && x.displayValue).forEach(sensor => {
                            let type = sensor.displayName
                            if (type === "temperature") {
                                sensorTypes.push("Temperature");
                            }
                            if (type === "humidity") {
                                sensorTypes.push("Humidity");
                            }
                            if (type === "illumination") {
                                sensorTypes.push("illumination");
                            }
                            if (type === "co2") {
                                sensorTypes.push("CO2");
                            }
                            if (type === "tvoc") {
                                sensorTypes.push("tvoc");
                            }
                            if (type === "pmv") {
                                sensorTypes.push("pmv");
                            }
                            if (type === "ppd") {
                                sensorTypes.push("ppd");
                            }
                        })
                        sensorTypes.splice(0, 0, 'Temperature');
                        sensorTypes.splice(1, 1, 'Humidity');
                        sensorTypes.splice(2, 2, 'CO2');
                        sensorTypes.splice(3, 3, 'tvoc');
                        sensorTypes.splice(4, 4, 'illumination');
                        sensorTypes.splice(5, 5, 'pmv');
                        sensorTypes.splice(6, 6, 'ppd');


                        let sensorData = {}
                            // console.log(levelSensors)
                        let positions = dataHelper.getPoints(viewer, model, {
                            id: sensor.properties.find(x => x.displayName === 'SensorName').displayValue,
                            name: sensor.properties.find(x => x.displayName === 'SensorName').displayValue,
                            dbId: sensor.dbId,
                            externalId: sensor.externalId,
                            type: "combo",
                            sensorTypes,
                        });

                        let position;
                        positions.then(res => {
                            // console.log(res.position)
                            position = res.position
                            let bounds = getObjectBounds(model, sensor.dbId)
                            levelSensors.push({
                                id: sensor.properties.find(x => x.displayName === 'SensorName').displayValue,
                                name: sensor.properties.find(x => x.displayName === 'SensorName').displayValue,
                                dbId: sensor.dbId,
                                externalId: sensor.externalId,
                                type: "combo",
                                sensorTypes,
                                position,
                                bounds
                            })
                        })




                        //  console.log()
                        //  console.log(positions.find(x => x.shadingPoints.find(x => x.dbId === sensor.dbId)))

                    })
                    devices.push({ id: level, dbIds, sensors: levelSensors })
                }
            });
            // console.log(devices)
            defer.resolve(devices)

        })

    })


    return defer.promise;;

}


async function getDevicesWithPositions(viewer, model, devicesList, dataHelper) {
    // console.log('hereeeee')
    let positions = await dataHelper.getAllPoints(viewer, model, devicesList);
    // console.log(positions.shadingPoints)
    let devices = []
    await positions.shadingPoints.forEach((point) => {
        let sensorTypes = [];
        if (point.types.includes("temperature")) {
            sensorTypes.push("Temperature");
        }
        if (point.types.includes("humidity")) {
            sensorTypes.push("Humidity");
        }
        if (point.types.includes("illumination")) {
            sensorTypes.push("illumination");
        }
        if (point.types.includes("co2")) {
            sensorTypes.push("CO2");
        }
        if (point.types.includes("tvoc")) {
            sensorTypes.push("tvoc");
        }
        devices.push({
            id: point.id,
            name: point.name,
            position: point.position,
            sensorTypes: sensorTypes,
            type: sensorTypes.length === 1 ?
                sensorTypes[0] : sensorTypes.length > 1 ?
                "combo" : "",
        });
    });
    // console.log(devices)

    return devices
}


function getObjectBounds(model, dbid) {
    const tree = model.getInstanceTree();
    const frags = model.getFragmentList();
    let bounds = new THREE.Box3();
    tree.enumNodeFragments(dbid, function(fragid) {
        let _bounds = new THREE.Box3();
        frags.getWorldBounds(fragid, _bounds);
        bounds.union(_bounds);
    }, true);
    // console.log(bounds)
    return bounds;
}



async function setupIconMarkup(viewer, devices) {
    let iconsPack = []
    await devices.forEach(device => {
        iconsPack.push({
            dbId: device.dbId,
            label: "300&#176;C",
            css: "fas fa-thermometer-full",
        })
    })
    console.log(iconsPack)
    viewer.loadExtension("IconMarkupExtension", {
        button: {
            icon: "fa-thermometer-half",
            tooltip: "Show Temperature",
        },
        icons: iconsPack,
        onClick: (id) => {
            console.log('id', id);
            viewer.select(id);
            viewer.utilities.fitToView();
            // switch (id) {
            //     case 12935:
            //         alert("Sensor offline");
            // }
        },
    });

    // [{
    //     dbId: 12538,
    //     label: "300&#176;C",
    //     css: "fas fa-thermometer-full",
    // },
    // {
    //     dbId: 12908,
    //     label: "300&#176;C",
    //     css: "fas fa-thermometer-full",
    // },
    // {
    //     dbId: 12916,
    //     label: "356&#176;C",
    //     css: "fas fa-thermometer-full",
    // },
    // { dbId: 12916, css: "fas fa-exclamation-triangle" },
    // ]
}
export { generateDevicesFromModel, getDevicesWithPositions, getObjectBounds, setupIconMarkup };