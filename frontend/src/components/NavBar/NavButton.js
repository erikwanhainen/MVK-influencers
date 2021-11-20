import React from "react";
import { NavLink } from "react-router-dom";

const NavButton = ({ path, children, className, value }) => {
  return (
    <li className={className ? className : "nav__menu-item"}>
      <NavLink
        to={path}
        isActive={(match, location) => {
          if (!match) {
            return false;
          }
        }}
      >
        {value}
      </NavLink>
      {children ? children : null}
    </li>
  );
};

export default NavButton;
