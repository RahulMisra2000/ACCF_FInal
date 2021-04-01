/* eslint-disable */
import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Checkbox,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
  Hidden,
  Paper
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import { useNavigate } from 'react-router-dom';
import green from '@material-ui/core/colors/green';

const returnColorBasedOnStatusAndRecStatus = (customer) => {
  if (customer.recStatus === 'Archive') {
      return "#bdbdbd";
  } else if (customer.status === 'Open') {
    return "#4caf50";
  } else if (customer.status === 'Close') {
    return "#795548";
  } 
}

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2),
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.primary.light
  },
  namecss: {
    color: (customer) => { 
      return returnColorBasedOnStatusAndRecStatus(customer);
    }
  }
}));

const Result = ({ className, customer, customerInListClicked, ...rest }) => {
  const classes = useStyles(customer);

  // STATE  
  const navigate = useNavigate();

  // HANDLERS
  const checkboxActivity = (event, id) => {
    console.log('checkbox activity');  
  };

  return (
    <TableRow
      onClick={(e) => { customerInListClicked(e, customer.id); }}
      hover
      key={customer.id}
    >
      {/* Checkbox */}
      <TableCell padding="checkbox">
        <Checkbox checked={false} onChange={(event) => checkboxActivity(event, customer.id)} value="true"/>
      </TableCell>

      {/* Name */}
      <TableCell>
        <Box display="flex" alignItems="center">
          <Avatar className={classes.avatar} src={customer.avatarUrl}>
            {getInitials(customer.name)}
          </Avatar>
          <Typography className={classes.namecss} variant="body1">
            {customer.name.slice(0,15)}
          </Typography>
        </Box>      
      </TableCell>

      {/* Phone */}
      <TableCell>
        {customer.phone}
      </TableCell>

      <Hidden only={['xs', 'sm']}>
        {/* uidEmail */}
        <TableCell>
          {customer.uidEmail.slice(0,15)}
        </TableCell>

        {/* Email */}
        <TableCell>
          {customer.email.slice(0,15)}
        </TableCell>
      
        {/* Created At */}
        <TableCell>
          {moment(customer.createdAt).format('MMMM Do YYYY, h:mm a')}
        </TableCell>

        {/* id */}
        <TableCell>
          {customer.id}
        </TableCell>

        {/* status */}
        <TableCell>
          {customer.status}
        </TableCell>

        {/* recStatus */}
        <TableCell>
          {customer.recStatus}
        </TableCell>
      </Hidden>
    </TableRow>
  );
};

Result.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object,
  customerInListClicked: PropTypes.func
};

export default Result;
