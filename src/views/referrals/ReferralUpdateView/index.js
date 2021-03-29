import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import ReferralDetails from './ReferralDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ReferralUpdate = () => {
  const classes = useStyles();
  const { id: rid } = useParams();

  return (
    <Page
      className={classes.root}
      title="Referral"
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          {/*
          <Grid
            item
            sm={3}
            xs={12}
          >
            <ReferralProfile rid={rid} />
          </Grid>
          */}
          <Grid
            item
            sm={9}
            xs={12}
          >
            <ReferralDetails rid={rid} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ReferralUpdate;
