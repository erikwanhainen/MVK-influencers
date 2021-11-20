import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "react-dropdown/style.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createList, toDateString } from "./graphListBuilder.js";
import Graph from "./Graph";
import "../TopList/TopListComponent.scss";
import "./Graph.scss";

function convertIntoGraphData(ledamoter, startDate, endDate) {
	let res = [];
	let dateString = toDateString(startDate);
	let date = new Date(dateString);
	for (const ledamot of ledamoter) {
		let data = [];
		let i = 0;
		let j = 0;
		for (; date <= endDate; date.setDate(date.getDate() + 1)) {
			if (ledamot.data[j] == null) {
				data[i] = { x: toDateString(date), y: null };
			} else if (new Date(ledamot.data[j].datum).getTime() === date.getTime()) {
				data[i] = {
					x: ledamot.data[j].datum,
					y: ledamot.data[j].resultat,
				};
				j++;
			} else {
				data[i] = { x: toDateString(date), y: null };
			}
			i++;
		}
		date = new Date(dateString);

		res.push({
			id: ledamot.label,
			data: data,
		}); //hur färger väljs måste implementeras
	}

	return res;
}

const GraphFetcher = () => {
	const statOptions = [
		{ value: "posneg", label: "Positivitet över tid" },
		{ value: "absent", label: "Frånvaro över tid" },
		{ value: "votedagainst", label: "Partiloyalitet över tid" },
	];

	const [selectedLedamoter, setSelectedLedamoter] = useState([]);
	const [selectedStat, setSelectedStat] = useState(statOptions[0]);
	const [ledamoter, setLedamoter] = useState([]);
	const [date, setdate] = useState({
		startDate: new Date("2020-01-01"),
		endDate: new Date("2020-03-20"),
	});
	const [graphData, setGraphData] = useState({
		data: [],
		startDate: date.startDate,
		endDate: date.endDate,
	});

	const StartDateCustomInput = ({ value, onClick }) => (
		<button className="startDate2" onClick={onClick}>
			{value}
		</button>
	);
	const StopDateCustomInput = ({ value, onClick }) => (
		<button className="endDate2" onClick={onClick}>
			{value}
		</button>
	);

	const customStyles = {
		option: (provided, state) => ({
			...provided,
			color: state.isSelected ? "black" : "black",
			backgroundColor: state.isSelected ? "lightgrey" : "white",
			backgroundColor: state.isFocused ? "lightgrey" : "white",
			border: "1px",
		}),
		control: (provided) => ({
			...provided,
			height: "45px",
			border: "0px",
			borderRadius: "6px",
			boxShadow: "0px",
			background: (78, 125, 152),
		}),
		singleValue: (base) => ({
			...base,
			color: "#fff",
		}),
		input: (base) => ({
			...base,
			color: "#fff",
		}),
		dropdownIndicator: (base) => ({
			...base,
			color: "#fff",
		}),
		loadingIndicator: (base) => ({
			...base,
			color: "#fff",
		}),
	};

	const isDisabled = false;
	const isLoading = false;
	const isClearable = true;
	const isRtl = false;
	const isSearchable = true;

	useEffect(() => {
		let promises = [];

		let newLedamot = [];
		for (let ledamot of selectedLedamoter) {
			promises.push(
				axios.get(
					"http://ec2-3-81-166-212.compute-1.amazonaws.com/api/v1/" +
						"getResultOverTime" +
						"?type=" +
						selectedStat.value +
						"&personid=" +
						ledamot.value
				)
			);
		}
		Promise.all(promises)
			.then((res) => {
				for (let i = 0; i < res.length; i++) {
					newLedamot.push({
						...selectedLedamoter[i],
						data: res[i].data,
					});
				}
				setGraphData({
					data: newLedamot,
					startDate: date.startDate,
					endDate: date.endDate,
				});
			})
			.catch((err) => console.log(err));
	}, [selectedLedamoter, selectedStat]);

	useEffect(() => {
		createList(selectedStat.value, date.startDate, date.endDate)
			.then((res) => {
				setLedamoter(res);
			})
			.then()
			.catch((err) => console.log(err));
	}, [selectedStat, date]);

	useEffect(() => {
		setGraphData((prev) => ({
			...prev,
			startDate: date.startDate,
			endDate: date.endDate,
		}));
	}, [date]);

	return (
		<div className="graphPageContainer">
			<div className="txt1">Välj graf</div>
			<div className="txt2">Välj personer</div>
			<div className="txt3">Välj startdatum</div>
			<div className="txt4">Välj slutdatum</div>
			<div className="startDatePos">
				<DatePicker
					selected={date.startDate}
					onChange={(startDate) =>
						setdate((prevState) => ({ ...prevState, startDate }))
					}
					name="startDate"
					customInput={<StartDateCustomInput />}
					dateFormat="yyyy-MM-dd"
					showYearDropdown="true"
					showMonthDropdown="true"
					withPortal
				/>
			</div>
			<div className="endDatePos">
				<DatePicker
					selected={date.endDate}
					onChange={(endDate) =>
						setdate((prevState) => ({ ...prevState, endDate }))
					}
					customInput={<StopDateCustomInput />}
					name="endDate"
					dateFormat="yyyy-MM-dd"
					showYearDropdown="true"
					showMonthDropdown="true"
					withPortal
				/>
			</div>
			<Select
				className="dropDown1"
				classNamePrefix="select"
				defaultValue={statOptions[0]}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isClearable={false}
				isRtl={isRtl}
				isSearchable={false}
				name="color"
				options={statOptions}
				value={selectedStat}
				onChange={(selectedStat) => setSelectedStat(selectedStat)}
				styles={customStyles}
			/>
			<Select
				className="ledamotDropDown"
				classNamePrefix="select"
				defaultValue={{ value: "Michael", label: "Michael" }}
				isDisabled={isDisabled}
				isMulti
				isLoading={isLoading}
				isClearable={isClearable}
				isRtl={isRtl}
				isSearchable={isSearchable}
				name="color"
				options={ledamoter}
				value={selectedLedamoter}
				onChange={(ledamoter) =>
					ledamoter === null
						? setSelectedLedamoter([])
						: setSelectedLedamoter(ledamoter)
				}
			/>
			<div className="graphContainer">
				<Graph
					data={convertIntoGraphData(
						graphData.data,
						graphData.startDate,
						graphData.endDate
					)}
				/>
			</div>
		</div>
	);
};

export default GraphFetcher;
