import React, { Component } from "react";
import axios from "axios";
import TopListComponent from "./TopListComponent";
import "react-dropdown/style.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const APIoptions = [
  { value: "getInfluence", label: "Kombinerat politiskt inflytande" },
  { value: "resultSAMostPos", label: "Mest positiv" },
  { value: "resultSAMostNeg", label: "Mest negativ" },
  { value: "getMostAbsent", label: "Mest frånvaro vid votering" },
  {
    value: "getVotedAgainstPartiMode",
    label: "Flest röster mot snitt av det egna partiet",
  },
];

class Fetcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      error: null,
      QUERY_START: "2019-01-01",
      QUERY_STOP: "2020-03-20",
      isLoading: false,
      selectedOption: APIoptions[0],
      startDate: new Date("2019-01-01"),
      stopDate: new Date("2020-03-20"),
    };

    this.handleChange = (selectedOption) => {
      this.setState({ selectedOption });
      this.setState({ isLoading: true }, () => this.componentDidMount());
    };
  }

  handleStartDateChange = (startDate) => {
    const { selectedOption } = this.state;
    this.setState({ startDate });
    this.setState({ QUERY_START: moment(startDate).format("YYYY-MM-DD") }, () =>
      this.handleChange(selectedOption)
    );
  };

  handleStopDateChange = (stopDate) => {
    const { selectedOption } = this.state;
    this.setState({ stopDate });
    this.setState({ QUERY_STOP: moment(stopDate).format("YYYY-MM-DD") }, () =>
      this.handleChange(selectedOption)
    );
  };

  componentDidMount() {
    axios
      .get(
        "http://ec2-3-81-166-212.compute-1.amazonaws.com/api/v1/" +
          this.state.selectedOption.value +
          "?startdate=" +
          this.state.QUERY_START +
          "&enddate=" +
          this.state.QUERY_STOP
      )
      .then((result) =>
        this.setState({
          list: result.data,
          isLoading: false,
        })
      )
      .catch((error) =>
        this.setState({
          error,
          isLoading: false,
        })
      );
  }

  render() {
    const { isLoading } = this.state;
    const { selectedOption } = this.state;

    const StartDateCustomInput = ({ value, onClick }) => (
      <button className="startDate" onClick={onClick}>
        {value}
      </button>
    );
    const StopDateCustomInput = ({ value, onClick }) => (
      <button className="stopDate" onClick={onClick}>
        {value}
      </button>
    );

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "black" : "black",
        backgroundColor: state.isSelected ? "lightgrey" : "white",
        backgroundColor: state.isFocused ? "lightgrey" : "white",
        border: "0px",
      }),
      control: (provided) => ({
        ...provided,
        border: "0px",
        borderRadius: "6px",
        boxShadow: "0px",
        background: (78, 125, 152),
        width: "100%",
        fontSize: "1.1vw",
      }),
      indicatorsContainer: (base) => ({
        ...base,
        height: "2.5vw",
      }),
      singleValue: (base) => ({
        ...base,
        color: "#fff",
        width: "100%",
        height: "2.5vw",
        position: "relative",
        marginTop: "1.7vw",
      }),
      input: (base) => ({
        ...base,
        color: "#fff",
        width: "100%",
        height: "100%",
      }),
      dropdownIndicator: (base) => ({
        ...base,
        color: "#fff",
        width: "100%",
        height: "auto",
      }),
      loadingIndicator: (base) => ({
        ...base,
        color: "#fff",
        width: "100%",
        height: "auto",
      }),
    };

    return (
      <div className="topListContainer">
        <div className="topTitles">Välj topplista</div>
        <div className="topTitles">Välj startdatum</div>
        <div className="topTitles">Välj slutdatum</div>
        <div className="topTitles">Filtrera på namn</div>
        <div className="topTitles">Filtrera på parti</div>
        <Select
          className="dropDown"
          defaultValue={APIoptions[0]}
          isLoading={isLoading}
          options={APIoptions}
          value={selectedOption}
          onChange={this.handleChange}
          styles={customStyles}
        />
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleStartDateChange}
          name="startDate"
          dateFormat="yyyy-MM-dd"
          customInput={<StartDateCustomInput />}
          showYearDropdown="true"
          showMonthDropdown="true"
          withPortal
        />
        <DatePicker
          selected={this.state.stopDate}
          onChange={this.handleStopDateChange}
          name="stopDate"
          dateFormat="yyyy-MM-dd"
          customInput={<StopDateCustomInput />}
          showYearDropdown="true"
          showMonthDropdown="true"
          withPortal
          todayButton="Idag"
        />
        <TopListComponent
          resultat={this.state.selectedOption.value !== "getInfluence"}
          listPosts={this.state.list}
        />
      </div>
    );
  }
}
export default Fetcher;
