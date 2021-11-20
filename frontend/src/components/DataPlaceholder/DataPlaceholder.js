import React from "react";
import "./DataPlaceholder.scss";

const DataPlaceholder = ({ children, overflowY }) => {
	return (
		<>
			<div className="mainWindowTopLine" />
			<div className="mainWindow" style={{ overflowY: overflowY }}>
				{children}
			</div>
		</>
	);
};

export default DataPlaceholder;
