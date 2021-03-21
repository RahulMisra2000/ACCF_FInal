import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Typography
} from '@material-ui/core';
import AppContext from 'src/contexts/appContext';

const useStyles = makeStyles(({
  root: {}
}));

const MiscInfo = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });
  const { cArray } = useContext(AppContext);

  // eslint-disable-next-line no-unused-vars
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Informational"
          title="Setting Values"
        />
        <Divider />
        <CardContent>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            # of Records in Cache (Customers) : {cArray?.length}
          </Typography>
        </CardContent>
        <Divider />
        {/*
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </Box>
        */}
      </Card>
    </form>
  );
};

MiscInfo.propTypes = {
  className: PropTypes.string
};

export default MiscInfo;
