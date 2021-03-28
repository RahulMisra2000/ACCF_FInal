import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';

const user = {
  avatar: '/static/images/avatars/avatar_cust.jpg',
  name: 'Highlights'
};

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  },
  rmcard: {
    border: '2px solid #c5cae9'
  }
}));

const CustProfile = ({ cid, className, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Card
      elevation={5}
      className={clsx(classes.root, className, classes.rmcard)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h6"
          >
            {cid}
            <Divider />
          </Typography>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            <Button color="primary" variant="outlined" size="small" onClick={() => { navigate(`/app/customers/activities/${cid}`); }}>My Activities</Button>
          </Typography>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            <Button color="primary" variant="outlined" size="small" onClick={() => { navigate(`/app/customers/${cid}/referrals`); }}>My Referrals</Button>
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      {/*
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
      */}
    </Card>
  );
};

CustProfile.propTypes = {
  className: PropTypes.string,
  cid: PropTypes.string
};

export default CustProfile;
