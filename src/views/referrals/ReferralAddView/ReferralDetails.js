/* eslint-disable */
import React, { useEffect, useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  Snackbar
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CRUDService from 'src/services/CRUDService';
import { useSnackbar } from 'notistack';
import Zoom from '@material-ui/core/Zoom';
import AppContext from '../../../contexts/appContext';
import useFirestore from 'src/services/useFirestoreForSmallCollections';

//#region STYLES
const useStyles = makeStyles(() => ({
  root: {}
}));
//#endregion

//#region Utility (optional)
// UTILITY FUNCTIONS that have nothing to do with the component
const makeEntryInGoogleSheet = (collectionName, d) => {
  // This I got from Postman
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
 
  // Just adding some more informational data for the Spreadsheet
  d.collectionName = collectionName;

  const raw = JSON.stringify(d);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // 1. cors anywhere that I downloaded --- https://github.com/Rob--W/cors-anywhere
  // 2. Installed Heroku CLI and then deploy cors-anywhere --- https://dashboard.heroku.com/apps/rahulmisra2000cb/deploy/heroku-git
  // 3. After deployment got this url https://rahulmisra2000cb.herokuapp.com/
  // which needs to be prepended to the Google App Script, as shown below
  
  return fetch(
    'https://rahulmisra2000cb.herokuapp.com/https://script.google.com/macros/s/AKfycbycpMf4R5bCeQ_kj3lMqYoqmhSeUy6IC_qD48D65mxmYh3Wxwyyy4G3oiZZtXZXkwzr4g/exec',
    requestOptions
  ).catch(() => {
    throw new Error('Error writing to Google App Script');
  });
};
//#endregion

const ReferralDetails = ({ className, ...rest }) => {
  const classes = useStyles();
 
  //#region CONTEXT
  const { isLoggedIn, signedInUsersEmail, addReferralRecordToCache } = useContext(AppContext);
  //#endregion

  //#region UTILITY FNs
  
  const showSnackbar = (msg) => {    
    enqueueSnackbar(msg, {
      anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
      },
      TransitionComponent: Zoom,
      variant: 'success' // success, error, warning, info, or default
    });
  };
  
  const getDefaultValuesForForm = () => {
    return {
      cid: '0',
      reason: '',
      referredFor: ' ',
      errors: {}
    };
  };

  const formFailsValidation = () => {
    let atLeastOneValidationFailed = false;
    let errorsObject = {};

    if (values.cid == '0') {                // validate customer id
      console.log('***********');
      errorsObject.cid = 'Selection is mandatory';
      atLeastOneValidationFailed = true;
    } 

    if (!Boolean(values.reason?.trim())) {             // validate reason
      errorsObject.reason = 'Selection is mandatory';
      atLeastOneValidationFailed = true;
    }
   
    console.log(values.referredFor);
    console.log(new Date(values.referredFor));

    if (!Boolean(values.referredFor?.trim())) {             // validate reason
      errorsObject.referredFor = 'Selection is mandatory';
      atLeastOneValidationFailed = true;
    }

    if (atLeastOneValidationFailed){
      setValues({...values, errors : {...errorsObject}}); // add all the errors to the state
    }
    else {
      setValues({...values, errors : {}});                // clear out the errors in the state
    }

    return atLeastOneValidationFailed ? true : false;
  };

  //#endregion
 
  //#region STATE 
  // set with a message after record is successfully to the Firestore
  const [submitted, setSubmitted] = useState(null);

  // Inside values is ALSO an errors object, which contains form validation errors
  const [values, setValues] = useState({});

  // set with a message if there is a problem writing to Firestore
  const [isError, setIsError] = useState(false);

  // to prevent several Add button clicks
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);

  //#endregion
  
  //#region UseEffect HOOK - Put default values in Form
  useEffect(()=>{
    setValues(getDefaultValuesForForm());   
    return () =>{
      //
    }; 
  },[]);
  //#endregion

  //#region OTHER HOOKS
  const { enqueueSnackbar } = useSnackbar();

  const {isLoading, data: cdata, error} = useFirestore({collectionName: 'customers'});
  if (cdata && cdata.length > 0 && cdata[0]?.name !== 'Select') {
    cdata.unshift({id:0, name:'Select'});
  }
  //#endregion

  //#region EVENT HANDLERS FOR FORMS
  // onChange event handler for Form Fields that we want React to control
  const handleChange = (event) => {    
    const { name, value } = event.target;    
    setValues({
      ...values,
      [name]: value
    });
  };

  // Add Button click event handler
  const addReferral = ({event, naam}) => {
    setAddButtonDisabled(true); // To prevent them from firing this multiple times

    // VALIDATE THE FORM NOW
    if (formFailsValidation()) {
      setAddButtonDisabled(false);
      return;
    }

    const creationMoment = Date.now();
    // Take data from Form and write to an object --- PREPARING DATA to be written to Firestore
    // Data coming from the Form
    
    // The date/time picker created values.referredFor. I am converting that so that it is like Date.now()
    const data = {
      cid: values.cid,
      reason: values.reason,
      referredFor: new Date(values.referredFor).getTime(),      
      followup: (() => {
        const arr = [];
        return arr;          
      })()  
    };

    // Other data not coming from the form
    data.createdAt = creationMoment;
    data.uid = isLoggedIn.uid;  // user id of the logged-in user
    data.uidEmail = signedInUsersEmail; // Email of the logged-in user
    data.status = 'Open';          // Open
    data.rating = null;
    data.recStatus = 'Live';

    // INSERT customer record in Firestore 
    CRUDService.create('referrals', data)
      .then((docRef) => {
          console.log(`referral id just created in Firestore is ${docRef.id}`);

          // WILL LATER (since state updates are async) SHOW ON-SCREEN MESSAGE
          setSubmitted(`Referral ${docRef.id} registered`);
          
          // ADD TO CACHE
          data.id = docRef.id;
          addReferralRecordToCache(data);

          // SHOW POPUP NOTIFICATION
          showSnackbar(`Referral ${docRef.id} registered`);

          // WRITE TO SPREADSHEET
          // If you enable this then you will need to do these two before the catch if 
          // you want to log out the response from the App Script
          // .then((response) => response.text())
          // .then((result) => console.log(result))  
          // return makeEntryInGoogleSheet('customers', {...data});
      })
      .catch((e) => {
          setIsError('Error registering Referral. Please try again.');
      });

    setAddButtonDisabled(false);
  };
  //#endregion
  
  //#region RETURN AREA

  // Loading
  if (isLoading){
    return (
      <div>
        <Alert severity="info">Loading data ...</Alert>
      </div>
    );
  }

  // Error
  if (isError || error){
    return (
      <div>
       {isError && <Alert severity="error">{isError}</Alert>}
       {error && <Alert severity="error">{error}</Alert>}
      </div>
    );
  }

  // Successfully added Referral record in database
  if (submitted){
      return (
        <div>
          <Alert severity="success">{submitted}</Alert>
        </div>        
      );
  }

  // SHOW THE FORM
  return (
    <>
        <form
          autoComplete="off"
          noValidate
          className={clsx(classes.root, className)}
          {...rest}
        >          
          {/* Referral Details */}
          <Card elevation={5}>
            <CardHeader title="Referral Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth label="Case" name="cid" onChange={handleChange} 
                    select SelectProps={{ native: true }} value={values.cid} variant="outlined" size="small" 
                    error={values.errors?.cid ? true : false}
                    helperText={values.errors?.cid ? values.errors?.cid : ''}
                    > 
                    {cdata?.map((rec) => (
                      <option key={rec.id} value={rec.id}>
                        {rec.name}
                      </option>
                    ))}
                  </TextField>              
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth label="Reason" name="reason" onChange={handleChange} required value={values.reason} variant="outlined" size="small" 
                    error={values.errors?.reason ? true : false}
                    helperText={values.errors?.reason ? values.errors?.reason : ''}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth name="referredFor" onChange={handleChange} 
                    type="datetime-local"
                    required value={values.referredFor} variant="outlined" size="small"
                    error={values.errors?.referredFor ? true : false}
                    helperText={values.errors?.referredFor ? values.errors?.referredFor : 'Enter Date of Appt'}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                 //
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button color="primary" variant="contained" disabled={addButtonDisabled} onClick={ (event)=>{addReferral({event, naam:null});} }>
                Add Referral
              </Button>
            </Box>
          </Card>          
      </form>
  </>
  );
  //#endregion

};

//#region propTypes
ReferralDetails.propTypes = {
  className: PropTypes.string
};
//#endregion 

export default ReferralDetails;
