import React, { useContext, useState, useEffect } from 'react';
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
  const { isLoggedIn, cArray } = useContext(AppContext);
  const [tokenDetails, setTokenDetails] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      isLoggedIn.getIdTokenResult()
        .then((details) => {
          // https://firebase.google.com/docs/reference/js/firebase.auth.IDTokenResult
          // eslint-disable-next-line max-len
          setTokenDetails({
            token: details.token,
            authTime: details.authTime,
            signInProvider: details.signInProvider,
            claims: details.claims
          });
        });
    }
  }, []);

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
            # of Records in Cache (Customers): {cArray?.length}
          </Typography>
          <Divider />
          <Typography
            color="textSecondary"
            variant="body1"
          >
            Token: {tokenDetails?.token}
          </Typography>

          <Typography
            color="textSecondary"
            variant="body1"
          >
            Auth Time: {tokenDetails?.authTime}
          </Typography>

          <Typography
            color="textSecondary"
            variant="body1"
          >
            SignIn Provider: {tokenDetails?.signInProvider}
          </Typography>

          {tokenDetails && Object.entries(tokenDetails?.claims).map((v) => {
            return (
              <Typography
                color="textSecondary"
                variant="body1"
                key={v[0]}
              >
                { `${v[0]} : ${v[1]}` }
              </Typography>
            );
          })}

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
