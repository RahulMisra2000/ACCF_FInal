import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const HackViewForDashboardLayout = ({ loc }) => {
  return (
    <Navigate to={loc} replace />
  );
};

HackViewForDashboardLayout.propTypes = {
  loc: PropTypes.string
};

export default HackViewForDashboardLayout;
