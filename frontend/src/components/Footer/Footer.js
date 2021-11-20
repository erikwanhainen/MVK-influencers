import React from "react";
import "./Footer.scss";
import { TwitterIcon, TwitterShareButton, EmailIcon, EmailShareButton, FacebookIcon, RedditIcon, WhatsappIcon } from "react-share";


const Footer = () => {
  return <div className="footer">
    <hr className="footerHR" style={{gridColumnStart: "2", gridColumnEnd: "5", gridRow: "2"}}></hr>
    <br />
    <span className="footerLeft" style={{gridColumn: "2", gridRow: "3"}}>
      <h2>The Politician Influencer Project</h2>
      <span>A KTH student project made in cooperation with the company Findwise</span>
      <br /><br />
      
      <img style={{marginTop: "0vh", marginLeft: "1vw", maxHeight: "2.9vw"}} src={require("../../resources/kth-logo-stor.png")} alt="kth logo" />
      <img style={{marginLeft: "1vw", maxHeight: "2.4vw"}} src={require("../../resources/findwise-logo.png")}  alt="findwise logo" />
    </span>

    <span className="footerCenter" style={{gridColumn: "3", gridRow: "3"}}>
      <br />
      <h3>Sitemap</h3>
      <a href="home">Hem</a>{" | "}
      <a href="graph">Graf</a>{" | "}
      <a href="about">Om</a>
      <br /><br /><br />
      <EmailIcon size={32} round={true} />{" "}<FacebookIcon size={32} round={true} />{" "}<TwitterIcon size={32} round={true} />{" "}<RedditIcon size={32} round={true} />{" "}<WhatsappIcon size={32} round={true} />
    </span>

    <span className="footerRight" style={{gridColumn: "4", gridRow: "3"}}>
      <h3>Kontakta oss</h3>
      <span>political.influence.project@gmail.com</span>
      <br /><br />
      <h3>Källa till data</h3>
      <span>Sveriges Riksdag</span>
    </span>
    

    <hr className="footerHR" style={{gridColumnStart: "2", gridColumnEnd: "5", gridRow: "4"}}></hr>

    <span style={{gridColumn: "3", gridRow: "5", textAlign: "center", fontSize: "0.5vw"}}>© Unauthorized duplication while sometimes necessary is never as good as the real thing.</span>
  </div>;
};

export default Footer;
