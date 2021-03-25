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

console.log('%c1st line of CustomerListView(index).js just executed', 'background-Color:black; color:white');

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  
  console.log('%cCustomerListView component code just executed','color:blue');
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState(null);
  
  // If the data is in cache it is got from there. If not then from Firestore. Then fills up the cache.
  const {isLoading, data: cdata, error} = useFirestore('customers');
  const [searchedData, setSearchedData] = useState([]);
  
  // searching happens with data in the cache
  const handleSearchTerm = (q) => {    
    if (q) {      
      setSearchedData(cdata.filter((v) => {
        return (v.name.includes(q) || v.email.includes(q));  // searching in name or email ... can be expanded to include more fields
      }));
    } else {
      setSearchedData([...cdata]);
    }
  };

  
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
          {!isLoading && cdata?.length ? (<Results customers={searchedData.length? searchedData : cdata} />) : null}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
