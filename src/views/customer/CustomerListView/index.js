/* eslint-disable */
import React, { useState, useContext } from 'react';
import { Box, Container, makeStyles, LinearProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Navigate } from 'react-router-dom';

import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import useFirestorePagination from 'src/services/useFirestorePagination';
import AppContext from 'src/contexts/appContext';

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
  // GUARD - only authenticated users
  const { isLoggedIn } = useContext(AppContext);
  if (!isLoggedIn) {    
    return (<Navigate to='/app/dashboard' />);
  }
  
  console.log('%cCustomerListView component code just executed','color:blue');
  const classes = useStyles();
  
  // STATE
    
  const [options, setOptions] = useState({
    collectionName: 'customers',
    direction: 'forward', 
    recordsToReadAtOneTime: 7,
    page: 1,
    q: null
  });
  const {isLoading, data: cdata, error} = useFirestorePagination(options);

  const [enableNext, setEnableNext] = useState(true);
  const [enablePrev, setEnablePrev] = useState(false);  

  const nextClicked = () => {
    // Early Exit
    if (!cdata || cdata.length == 0 || cdata.length < options.recordsToReadAtOneTime) {
      console.log("There isn't more data");      
      setEnableNext(false);
      return;
    }
    setEnableNext(true);
    setEnableNext(true);

    setOptions((prevstate) => {
      // NEVER MUTATE STATE IN REACT, ALWAYS RETURN A NEW OBJECT
      return {
        ...prevstate, 
        page: prevstate.page + 1,
        direction: 'forward'
      };
    });
  };

  const prevClicked = () => {
    // Early Exit
    if (options.page <= 1) {
      console.log("No previous data");
      setEnablePrev(false);
      return;
    }

    setEnableNext(true);
    setOptions((prevstate) => {
      // NEVER MUTATE STATE IN REACT, ALWAYS RETURN A NEW OBJECT
      return {
        ...prevstate, 
        page: prevstate.page - 1,
        direction: 'backward'
      };
    });
  };

  // searching happens with data in the cache
  const handleSearch = (q) => {   
    console.log(q);
         
    setOptions((prevstate) => {      
      return {
        ...prevstate, 
        page: 1,
        direction: 'forward',
        q: q
      };
    });
  };

  //#region RETURN AREA
 
  const noRecordsAtAll = () => {
    return error == '999' ? true : false;
  };
  const noMoreRecords = () => {
    return error == '1' ? true : false;
  };
  const networkError = () => {
    return (error && (error !== '999' && error !== '1') ? true : false);
  };

  console.log('%cPage Number:' + options.page, 'color:red');


  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar searchFn={(q) => { handleSearch(q); }}/>
        <Box mt={3}>
          {isLoading && <LinearProgress color="secondary" />}
          {networkError() && <Alert severity="error">{error}</Alert>}
          {noRecordsAtAll() ? <Alert severity="error">No Customer Records</Alert> : null}
                    
          {!isLoading && !noRecordsAtAll() && !networkError()
            ? ( 
                <Results customers={cdata} 
                        prevClicked={prevClicked} 
                        nextClicked={nextClicked}
                        enablePrev={options.page > 1 ? true : false}
                        enableNext={enableNext && !noMoreRecords()}
                />
              ) 
            : null
          }
        </Box>
      </Container>
    </Page>
  );
  //#endregion
};

export default CustomerListView;
