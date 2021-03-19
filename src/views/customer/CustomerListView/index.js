/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
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
  const classes = useStyles();
  
  /* LIVE DATA
  // useCollection hook, provides cdata. cdata.docs is an array. Each element is a live link to the record in Firestore.
  // You can do the array map on it ....  (v,i,a)=> v.id  is the unique id and v.data() is the rest of the record
  // v.data().x where x is the field name will give you the value of the field
  const [cdata, loading, error] = useCollection(
    CustomerDataService.getAll().orderBy('name', 'asc')
  );
  */

  const {isLoading, data: cdata, error} = useFirestore('customers');

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {isLoading && <span>Collection: Loading...</span>}
        {cdata?.length == 0 ? <strong>No Customer Record(s)</strong> : null}
        {cdata && cdata.length ? (<Results customers={cdata} />) : null}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
