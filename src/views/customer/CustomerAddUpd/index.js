import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerAddUpd = () => {
  const classes = useStyles();
  const { id: cid } = useParams();

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
          <Grid
            item
            lg={2}
            md={3}
            xs={12}
          >
            <Profile />
          </Grid>
          <Grid
            item
            lg={10}
            md={9}
            xs={12}
          >
            <ProfileDetails cid={cid} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default CustomerAddUpd;
