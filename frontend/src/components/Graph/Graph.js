import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

class Graph extends Component {
	/*   constructor() {
      super();
  } */
	render() {
		return (
			<ResponsiveLine
				data={this.props.data}
				margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
				xScale={{
					type: "time",
					format: "%Y-%m-%d", //Används för att parse x värdena
					precision: "day",
				}}
				yScale={{
					type: "linear",
					min: "auto",
					max: "auto",
					stacked: false,
					reverse: false,
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					orient: "bottom",
					tickSize: 5,
					tickPadding: 15,
					tickRotation: 45,
					legend: "",
					legendOffset: -20,
					legendPosition: "middle",
					format: "%b %d", //Format för att printa label
					tickValues: "every month", //Funkar nu
					/*tickValues: this.props.data[0].data
            .filter((v, i) => i % 2 == 0)
            .map((el) => el.x),*/ //Alternativt sätt för att t.ex. få varannat värde. Verkar ibland vara mer reliable?
				}}
				axisLeft={{
					orient: "left",
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "",
					legendOffset: 0,
					legendPosition: "middle",
				}}
				//colors={{ scheme: 'nivo' }} this doesn't seem to work
				lineWidth={3}
				pointSize={10}
				pointColor={{ theme: "background" }}
				pointBorderWidth={3}
				pointBorderColor={{ from: "serieColor", modifiers: [] }}
				enablePointLabel={true}
				tooltip={() => null} //disabled tooltip as react cannot render it properly right now
				pointLabel="y"
				pointLabelYOffset={-12}
				useMesh={true}
				legends={[
					{
						anchor: "bottom-right",
						direction: "column",
						justify: false,
						translateX: 80,
						translateY: 0,
						itemsSpacing: 0,
						itemDirection: "left-to-right",
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 4,
						symbolShape: "circle",
						symbolBorderColor: "rgba(0, 0, 0, .5)",
						effects: [
							{
								on: "hover",
								style: {
									itemBackground: "rgba(0, 0, 0, .03)",
									itemOpacity: 1,
								},
							},
						],
					},
				]}
			/>
		);
	}
}
export default Graph;
