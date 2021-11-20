import React, { Component } from "react";
import "./About.scss";

/**
 * Home component containing the first page of the site with logos and link to GitHub.
 */
class About extends Component {
  render() {
    return (
        <>
            <div className="containerTop" id="containerTop">
                <h1 style={{gridRowStart: "2"}}>Projektet</h1>
                <span style={{gridRowStart: "3"}}>Projektet är en del av kursen DD1393 Mjukvarukonstruktion som hålls på KTH vilka samtliga i teamet varit en del av.</span>
                <span style={{gridRowStart: "4"}}>Projektet har utförts i samverkan med Findwise AB och utformats utifrån de grundläggande kraven som efterfrågats.</span>
                <span style={{gridRowStart: "5"}}>Sidan ämnas visualisera vilka politiker som försöker vara de mest inflytelserika i Sveriges Riksdag genom att använda data från Riksdagens API.</span>
                <img style={{gridColumnStart: "1", gridRowStart: "6", marginLeft: "auto", marginRight: "3vw", marginTop: "1.5vw", maxHeight: "16vh", maxWidth: "16vw"}} src={require("../../resources/kth-logo-stor.png")} alt="kth logo" />
                <img style={{gridColumnStart: "2", gridRowStart: "6", marginLeft: "0vw", marginRight: "auto", marginTop: "3vw", maxHeight: "10vh", maxWidth: "20vw"}} src={require("../../resources/findwise-logo.png")}  alt="findwise logo" />
            </div>

            <div className="indicator">
                <a href="#inflytande"><span></span></a>
            </div>

            <div className="containerCenter" id="inflytande">
                <img src={require("../../resources/riksdagen.jpg")} alt="riksdagen" style={{gridColumnStart: "1", gridRowStart: "1", gridRowEnd: "5", marginLeft: "auto", marginRight: "2vw", marginTop: "18vh", maxWidth: "30vw"}}/>
                <h1 style={{gridRowStart: "1"}}>Inflytande</h1>
                <p style={{gridRowStart: "2"}}>
                    Definitionen av inflytande och vad det innebär i detta sammanhang sträcker sig längre än vad som rimligt finns möjlighet att svara på inom detta projekts ramar.
                </p>
                <p style={{gridRowStart: "3"}}>
                    Vad vi har valt att visa är data för de faktorer som vi tror spelar en roll när en politiker försöker vara inflytesrik. Dessa är framförallt:
                </p>
                <p style={{gridRowStart: "4"}}>
                    Deras närvaro i riksdagen
                    <br />Huruvida de röstar med eller emot sitt parti
                    <br />Om deras utalanden är extremt negativa, positiva eller neutrala
                </p>
            </div>

            <div className="indicator">
                <a href="#arbetslaget"><span></span></a>
            </div>

            <div className="containerBottom" id="arbetslaget">
                <h1 style={{gridRowStart: "1", gridColumn: "2", gridColumnEnd: "8"}}>Arbetslaget</h1>

                <div className="avatar" style={{gridRow: "2", gridColumn: "3"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "3", gridColumn: "3"}}>
                    Michael Wink
                    <br /><span className="containerBottomTitle">Project Owner</span>
                </div>

                <div className="avatar" style={{gridRow: "2", gridColumn: "4"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "3", gridColumn: "4"}}>
                    Erik Vanhainen
                    <br /><span className="containerBottomTitle">Scrum Master</span>
                </div>
                
                <div className="avatar" style={{gridRow: "2", gridColumn: "5"}}><img src={require("../../resources/avatar.jpg")}></img></div>
                <div className="containerBottomName" style={{gridRow: "3", gridColumn: "5"}}>
                    Markus Tollet
                    <br /><span className="containerBottomTitle">Data Processing</span>
                </div>

                <div className="avatar" style={{gridRow: "2", gridColumn: "6"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "3", gridColumn: "6"}}>
                    Aissata Maiga
                    <br /><span className="containerBottomTitle">Data Processing</span>
                </div>
                
                <div className="avatar" style={{gridRow: "5", gridColumn: "3"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "6", gridColumn: "3"}}>
                    Johanna Löv
                    <br /><span className="containerBottomTitle">Data Management / UI</span>
                </div>
                
                <div className="avatar" style={{gridRow: "5", gridColumn: "4"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "6", gridColumn: "4"}}>
                    Daniel Onegård
                    <br /><span className="containerBottomTitle">Backend</span>
                </div>

                <div className="avatar" style={{gridRow: "5", gridColumn: "5"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "6", gridColumn: "5"}}>
                    Pontus Cowling Mantefors
                    <br /><span className="containerBottomTitle">Frontend</span>
                </div>
                
                <div className="avatar" style={{gridRow: "5", gridColumn: "6"}}><img src={require("../../resources/avatar.jpg")} alt="default avatar"></img></div>
                <div className="containerBottomName" style={{gridRow: "6", gridColumn: "6"}}>
                    Viktor Åryd
                    <br /><span className="containerBottomTitle">Frontend</span>
                </div>

                <div className="indicatorUp" style={{gridRow: "7", gridColumnStart: "4", gridColumnEnd: "6"}}>
                    <a href="about"><span></span></a>
                </div>
            </div>


        </>
    );
  }
}

export default About;
