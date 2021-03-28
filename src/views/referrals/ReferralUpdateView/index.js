import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import CustProfile from './ReferralProfile';
import CustDetails from './ReferralDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerUpdate = () => {
  const classes = useStyles();
  const { id: cid } = useParams();

  return (
    <Page
      className={classes.root}
      title="Customer"
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            sm={3}
            xs={12}
          >
            <CustProfile cid={cid} />
          </Grid>
          <Grid
            item
            sm={9}
            xs={12}
          >
            <CustDetails cid={cid} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default CustomerUpdate;
