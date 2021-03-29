/* eslint-disable */
import React, { useState, useContext } from 'react';
import { Box, Container, makeStyles, LinearProgress } from '@material-ui/core';
import { Navigate, useParams } from 'react-router-dom';

import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import useFirestore from 'src/services/useFirestore';
import AppContext from 'src/contexts/appContext';

console.log('%c1st line of ReferralListView(index).js just executed', 'background-Color:black; color:white');

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));
 
const ReferralListView = () => {
  // GUARD - only authenticated users can continue
  const { isLoggedIn } = useContext(AppContext);
  if (!isLoggedIn) {    
    return (<Navigate to='/app/dashboard' />);
  }
  // GUARD

  let whereClause = null;
  // Depending on which path brings to this component, cid will be null or it will have some customer id 
  const { id: cid } = useParams(); 
  
  console.log('%cReferralsListView component code just executed','color:blue');
  const classes = useStyles();
  
  // If the data is in cache it is got from there. If not then from Firestore. Then fills up the cache.
  const {isLoading, data: rdata, error} = useFirestore({collectionName: 'referrals', recordsForThisId: cid});
  const [searchedData, setSearchedData] = useState([]);
  
  // searching happens with data in the cache
  const handleSearchTerm = (q) => {    
    if (q) {      
      setSearchedData(rdata.filter((v) => {
        return (v.name.includes(q) || 
                v.email.includes(q) ||
                v.uidEmail.includes(q)
                );  // searching in name or email ... can be expanded to include more fields
      }));
    } else {
      setSearchedData([...rdata]);
    }
  };

  
  return (
    <Page
      className={classes.root}
      title="Referrals"
    >
      <Container maxWidth={false}>
        <Toolbar searchFn={(q) => { handleSearchTerm(q); }}/>
        <Box mt={3}>
          {error && <strong>Error: {JSON.stringify(error)}</strong>}
          {isLoading && <LinearProgress color="secondary" />}
          {!isLoading && rdata?.length == 0 ? <strong>No Referrals Record(s)</strong> : null}
          {!isLoading && rdata?.length ? (<Results referrals={searchedData.length? searchedData : rdata} />) : null}
        </Box>
      </Container>
    </Page>
  );
};

export default ReferralListView;
