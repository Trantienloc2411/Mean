import React from "react";
import PropTypes from "prop-types";
import { Flex } from "antd";

const CardDashboard = ({
  title,
  value,
  iconName,
  backgroundColorIcon = "#d0cfff",
  colorIcon = "#8280FF",
  height = 120,
  width = 240, // default to a number
}) => {
  const containerStyles = {
    height: typeof height === "number" ? height : parseInt(height, 10),
    minWidth: typeof width === "number" ? width : parseInt(width, 10),
    width: typeof width === "string" ? width : undefined, // set width if string (e.g., '20%')
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.12)",
    },
  };

  const titleStyles = {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  };

  const numberStyles = {
    margin: 0,
    fontWeight: "600",
    fontSize: "28px",
    color: "#1a1f36",
  };

  const iconBgStyles = {
    background: backgroundColorIcon,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    padding: "12px",
    marginLeft: "16px",
  };

  const iconStyles = {
    fontSize: "30px",
    color: colorIcon,
  };

  return (
    <div style={containerStyles}>
      <Flex justify="space-between">
        <Flex vertical>
          <p style={titleStyles}>{title}</p>
          <p style={numberStyles}>{value}</p>
        </Flex>
        <div style={iconBgStyles}>
          {iconName
            ? React.cloneElement(iconName, { style: iconStyles })
            : null}
        </div>
      </Flex>
    </div>
  );
};

// Prop Type Checking
CardDashboard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconName: PropTypes.element,
  backgroundColorIcon: PropTypes.string,
  colorIcon: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // allow both
};

export default CardDashboard;
