import React, { Component } from "react";
import Fetcher from "../../components/TopList/Fetcher";
import "./Home.scss"
import DataPlaceholder from "../../components/DataPlaceholder/DataPlaceholder";

class Home extends Component {
    render() {
        return (
            <div>
                <div className="home_background"></div>
                <div>
                    <DataPlaceholder overflowY="scroll">
                        <Fetcher />
                    </DataPlaceholder>
                </div>
            </div>
        );
    }
}

export default Home;
