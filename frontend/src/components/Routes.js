import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "../pages/Home/Home";
import Graph from "../pages/Graph/Graph";
import About from "../pages/About/About";

const Routes = () => (
  <Switch>
    <Route path="/home" component={Home} />
    <Route path="/graph" component={Graph} />
    <Route path="/about" component={About} />
    <Route component={Home} />
    <Redirect to="/home" />
  </Switch>
);

export default Routes;
