import React from "react";
import PropTypes from 'prop-types';
import { useLocation, Link } from "react-router-dom";

import { Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import styles from "./navLink.module.scss";

const NavLink = ({ children, href }) => {
  const router = useLocation();
  const theme = useTheme();
  return (
    <Link to={href}>
      <Typography
        as="p"
        variant={"h4"}
        color={
          router.pathname === href
            ? theme.palette.white.main
            : theme.palette.neutral.white200
        }
        className={`${styles.navLink} ${
          router.pathname == href ? styles.active : ""
        }`}
        style={
          router.pathname == href ? {backgroundColor: theme.palette.neutral.secondary300} : {}
        }
      >
        {children}
      </Typography>
    </Link>
  );
};

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
}

export default NavLink;
