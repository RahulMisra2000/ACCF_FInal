/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import { useCollection } from 'react-firebase-hooks/firestore';

import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
// import data from './data';
import CustomerDataService from '../../../services/CustomerService';
import useFirestore from 'src/services/useFirestore';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  console.log('First line of CustomerListView Component');
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState(null);

  // Gets the data from Firestore
  const {isLoading, data: cdata, error} = useFirestore('customers', searchTerm);

  // Just changes the state so that this and all child components are re-rendered (aka component is re-executed from top to bottom)
  const handleSearchTerm = (q) => {
    if (q) {
      setSearchTerm(q);
    }
    if (searchTerm && !q) {
      setSearchTerm(q);
    }
  };

  console.log(error);
  
  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar searchFn={(q) => { handleSearchTerm(q); }}/>
        <Box mt={3}>
          {error && <strong>Error: {JSON.stringify(error)}</strong>}
          {isLoading && <LinearProgress color="secondary" />}
          {!isLoading && cdata?.length == 0 ? <strong>No Customer Record(s)</strong> : null}
          {!isLoading && cdata?.length ? (<Results customers={cdata} />) : null}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
