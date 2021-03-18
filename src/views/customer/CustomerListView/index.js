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
  
  // useCollection hook, provides cdata. cdata.docs is an array. Each element is a live link to the record in Firestore.
  // You can do the array map on it ....  (v,i,a)=> v.id  is the unique id and v.data() is the rest of the record
  // v.data().x where x is the field name will give you the value of the field
  const [cdata, loading, error] = useCollection(
    CustomerDataService.getAll().orderBy('name', 'asc')
  );
  
  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {cdata?.docs?.length == 0 ? <strong>No Customer Records</strong> : null}
        {cdata && cdata.docs.length ? (<Results customers={cdata.docs} />) : null}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
