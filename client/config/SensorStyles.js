import circleSvg from "../../assets/images/circle.svg";
import circleHighlightedSvg from "../../assets/images/circle_highlighted.svg";
import temperatureSvg from "../../assets/images/temperature_property.svg";
import humiditySvg from "../../assets/images/humidity_property.svg";
import co2Svg from "../../assets/images/co2_property.svg";
import tvocSvg from "../../assets/images/tvoc.svg";
import illuminationSvg from "../../assets/images/brightness.svg";

export const SpriteSize = 24;

/**
 * @type {SensorStyleDefinitions}
 */
export const SensorStyleDefinitions = {
  default: {
    url: circleSvg,
    highlightedUrl: circleHighlightedSvg,
    color: 0xffffff,
    highlightedColor: 0xffffff,
    //You may use this instead of highlightedUrl and highlightedColor to simply color over the regular url image
    // highlightedColor: 0xa1c5ff,
  },
};

/**
 * A map that maps a property ID with its corresponding color stop values.
 * This mapping is used for both heatmap rendering, as well as for heatmap
 * slider background color. See registerSurfaceShadingColors API for usage
 * details.
 */
export const PropIdGradientMap = {
  Temperature: [0x0000ff, 0xffff00, 0xff0000],
  illumination: [0x0000ff, 0x00ff00, 0xff0000],
  tvoc: [0xc034eb, 0xf5ce42, 0x4287f5],
  Humidity: [0x00f260, 0x00ff00, 0x0575e6],
  "CO₂": [0x1e9600, 0xfff200, 0xff0000],
  co2: [0x1e9600, 0xfff200, 0xff0000],
  CO2: [0x1e9600, 0xfff200, 0xff0000],
  pmv: [0x1794cf, 0xcfb617, 0xcf3c17],
  ppd: [0xc034eb, 0xf5ce42, 0x4287f5],
};

export const PropertyIconMap = {
  Temperature: temperatureSvg,
  Humidity: humiditySvg,
  "CO₂": co2Svg,
  co2: co2Svg,
  CO2: co2Svg,
  tvoc: tvocSvg,
  illumination: illuminationSvg,
  pmv: illuminationSvg,
  ppd: illuminationSvg,
};
