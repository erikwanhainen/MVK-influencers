import React, { Component } from "react";
import DataPlaceholder from "../../components/DataPlaceholder/DataPlaceholder";
import "./Graph.scss";
import GraphFetcher from "../../components/Graph/GraphFetcher.js";

class Graph extends Component {
	render() {
		return (
			<div>
				<div className="graph_background"></div>
				<div>
					<DataPlaceholder overflowY="auto">
						<GraphFetcher />
					</DataPlaceholder>
				</div>
			</div>
		);
	}
}

export default Graph;
