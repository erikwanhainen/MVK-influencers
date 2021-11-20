import React, { Component } from "react";
import * as d3 from "d3";

/**
 * BarChart component drawing a basic example of a D3 bar chart.
 */
class BarChart extends Component {
  /**
   * Dummy data for D3 bar chart example
   * @type {Array}
   */
  componentDidMount() {
    const data = [2, 4, 2, 6, 8, 10, 3, 7, 1, 5, 4, 3, 2];
    this.drawBarChart(data);
  }

  /**
   * Function that draws the D3 example chart.
   * @param {Array} data
   */
  drawBarChart(data) {
    const canvasHeight = 400;
    const canvasWidth = 580;
    const scale = 20;
    const svgCanvas = d3
      .select(this.refs.canvas)
      .append("svg")
      .attr("width", canvasWidth)
      .attr("height", canvasHeight)
      .style("border", "1px solid black");
    svgCanvas
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 40)
      .attr("height", datapoint => datapoint * scale)
      .attr("fill", "orange")
      .attr("x", (datapoint, iteration) => iteration * 45)
      .attr("y", datapoint => canvasHeight - datapoint * scale);
  }
  render() {
    return <div ref="canvas"></div>;
  }
}
export default BarChart;
