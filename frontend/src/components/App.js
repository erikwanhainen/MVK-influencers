import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../stylesheets/stylesheet.scss";
import NavBar from "./NavBar/NavBar";
import Routes from "./Routes";
import Footer from "./Footer/Footer";

/**
 * Main class App returning the navigation bar component and the routes component.
 */
class App extends Component {
  render() {
    var RoutesSync = withRouter(Routes);
    return (
      <div className="App">
        <NavBar />
        <RoutesSync />
        <Footer />
      </div>
    );
  }
}

export default App;
