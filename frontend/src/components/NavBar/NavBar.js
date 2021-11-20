import React from "react";
import NavButton from "./NavButton";
import "./NavBar.scss";

/**
 * Menu component for the navigation bar with functionality for mouse-over extending menu options.
 */

const NavBar = () => {
  return (
    <nav className="nav">
      <ul className="nav__menu">
        <NavButton path="/" value="Hem" />
        <NavButton path="/graph" value="Graf" />
        <NavButton path="/about" value="Om"></NavButton>
      </ul>
    </nav>
  );
};

export default NavBar;
