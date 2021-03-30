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
  const [searchedData, setSearchedData] = useState([]);
  
  const [options, setOptions] = useState({
    collectionName: 'customers',
    direction: 'forward', 
    recordsToReadAtOneTime: 4,
    page: 1
  });
  const {isLoading, data: cdata, error} = useFirestorePagination(options);
  const [enableNext, setEnableNext] = useState(true);

  const nextClicked = () => {
    // Early Exit
    if (!cdata || cdata.length == 0 || cdata.length < options.recordsToReadAtOneTime) {
      console.log("There isn't more data");      
      setEnableNext(false);
      return;
    }
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
  const handleSearchTerm = (q) => {    
    if (q) {      
      setSearchedData(cdata.filter((v) => {
        return (v.name.includes(q) || 
                v.email.includes(q) ||
                v.uidEmail.includes(q)
                );  // searching in name or email ... can be expanded to include more fields
      }));
    } else {
      setSearchedData([...cdata]);
    }
  };

  //#region RETURN AREA
  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar searchFn={(q) => { handleSearchTerm(q); }}/>
        <Box mt={3}>
          {isLoading && <LinearProgress color="secondary" />}
          {error && <Alert severity="error">{error}</Alert>}
          {!isLoading && cdata?.length == 0 ? <Alert severity="error">No Customer Records</Alert> : null}
          {!isLoading && cdata?.length 
            ? (<Results customers={searchedData.length? searchedData : cdata} 
                        prevClicked={prevClicked} 
                        nextClicked={nextClicked}
                        enablePrev={options.page > 1 ? true : false}
                        enableNext={enableNext}
                        />) 
            : null
          }
        </Box>
      </Container>
    </Page>
  );
  //#endregion
};

export default CustomerListView;
