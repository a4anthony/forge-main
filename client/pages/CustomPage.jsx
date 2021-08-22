import React from "react";
import {Viewer} from "forge-dataviz-iot-react-components";

/**
 * An interface file to allow customers to have their custom built application page.
 */
function CustomPage(props) {
    const {env, docUrn} = props.appData;


    async function onModelLoaded(viewer, data) {
        const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
        // Given a model loaded from Forge
        const structureInfo = new Autodesk.DataVisualization.Core.ModelStructureInfo(data.model);

        const devices = [
            {
                id: "Oficina 6", // An ID to identify this device
                name: "Oficina-",
                position: {
                    x: 14.113521099090576,
                    y: 85.30265045166016,
                    z: -11.539016246795654
                }, // World coordinates of this device
                sensorTypes: ["temperature", "humidity"], // The types/properties this device exposes
            }
        ];
        // var offset = viewer.model.getGlobalOffset();
        // removeOffset(devices[0], offset)
        // Generates `SurfaceShadingData` after assigning each device to a room.
        const shadingData = await structureInfo.generateSurfaceShadingData(devices);
        console.log(shadingData)
        shadingData.initialize(data.model);
        await dataVizExtn.setupSurfaceShading(data.model, shadingData, {
            type: "PlanarHeatmap",
            placePosition: "max",
        });
        // Use the resulting shading data to generate heatmap from.
        // await dataVizExtn.setupSurfaceShading(data.model, shadingData);
        // Register color stops for the heatmap. Along with the normalized sensor value
        // in the range of [0.0, 1.0], `renderSurfaceShading` will interpolate the final
        // heatmap color based on these specified colors.
        const sensorColors = [0x0000ff, 0x00ff00, 0xffff00, 0xff0000];

        // Set heatmap colors for temperature
        const sensorType = "temperature";
        dataVizExtn.registerSurfaceShadingColors(sensorType, sensorColors);

        // Function that provides sensor value in the range of [0.0, 1.0]
        function getSensorValue(surfaceShadingPoint, sensorType) {
            // The `SurfaceShadingPoint.id` property matches one of the identifiers passed
            // to `generateSurfaceShadingData` function. In our case above, this will either
            // be "cafeteria-entrace-01" or "cafeteria-exit-01".
            // const deviceId = surfaceShadingPoint.id;
            //
            // // Read the sensor data, along with its possible value range
            // let sensorValue = readSensorValue(deviceId, sensorType);
            // const maxSensorValue = getMaxSensorValue(sensorType);
            // const minSensorValue = getMinSensorValue(sensorType);
            //
            // // Normalize sensor value to [0, 1.0]
            // sensorValue = (sensorValue - minSensorValue) / (maxSensorValue - minSensorValue);
            let sensorValue = Math.random()
            return sensorValue;
        }

        // This value can also be a room instead of a floor
        const floorName = "Level 0";
        dataVizExtn.renderSurfaceShading(floorName, sensorType, getSensorValue);


        console.log('model loaded')
    }

    function removeOffset(pos, offset) {
        pos.position.x = pos.position.x - offset.x;
        pos.position.y = pos.position.y - offset.y;
        pos.position.z = pos.position.z - offset.z;
    }


    return (
        <Viewer
            env={env}
            docUrn={docUrn}
            onModelLoaded={onModelLoaded}
            getToken={async () =>
                await fetch("/api/token")
                    .then((res) => res.json())
                    .then((data) => data.access_token)
            }
        />
    );
}

export default CustomPage;
