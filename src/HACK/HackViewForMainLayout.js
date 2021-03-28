import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const HackViewForMainLayout = ({ loc }) => {
  return (
    <Navigate to={loc} replace />
  );
};

HackViewForMainLayout.propTypes = {
  loc: PropTypes.string
};

export default HackViewForMainLayout;
