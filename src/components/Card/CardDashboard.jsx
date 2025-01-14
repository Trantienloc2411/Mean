import React from "react";
import PropTypes from "prop-types";
import { FaUserFriends } from "react-icons/fa";
import { Flex } from "antd";

const Card = ({
  title,
  value,
  iconName,
  backgroundColorIcon = "#d0cfff",
  colorIcon = "#8280FF",
  height = 100,
  width = 230,
}) => {
  const containerStyles = {
    height: `${height}px`,
    minWidth: `${width}px`,
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const titleStyles = {
    margin: 0,
    fontSize: "14px",
    color: "#666",
  };

  const numberStyles = {
    margin: 0,
    fontWeight: "bold",
    fontSize: "24px",
  };

  const iconBgStyles = {
    background: backgroundColorIcon,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    padding: "10px",
    marginLeft: "10px",
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

// Default Props
Card.defaultProps = {
  title: "Default Title",
  value: 0,
  iconName: <FaUserFriends />,
  backgroundColorIcon: "#d0cfff",
  colorIcon: "#8280FF",
  height: 100,
  width: 230,
};

// Prop Type Checking
Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconName: PropTypes.element,
  backgroundColorIcon: PropTypes.string,
  colorIcon: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default Card;
