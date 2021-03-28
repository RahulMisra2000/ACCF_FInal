import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import CustDetails from './CustDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerAdd = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Customer"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          {/*
          <Grid
            item
            lg={2}
            md={3}
            xs={12}
          >
            <CustProfile />
          </Grid>
          */}
          <Grid
            item
            lg={10}
            md={9}
            xs={12}
          >
            <CustDetails />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default CustomerAdd;
