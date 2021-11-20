import React from "react";
import NavButton from "./NavButton";

/**
 * Submenu component specific for the "About" option in the navigation bar.
 */
const NavSubMenu = ({ values }) => {
  return (
    <ul className="nav__submenu">
      {values.map((el) => (
        <NavButton
          path={el.path}
          className="nav__submenu-item"
          value={el.title}
        />
      ))}
    </ul>
  );
};

export default NavSubMenu;
