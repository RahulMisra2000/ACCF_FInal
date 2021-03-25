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
import CustomerDataService from 'src/services/CustomerService';
import { useSnackbar } from 'notistack';
import Zoom from '@material-ui/core/Zoom';
import AppContext from '../../../contexts/appContext';
import dataForSelect from 'src/dataForSelect';

console.dir(dataForSelect.levelType);

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

// UTILITY FUNCTION
const makeEntryInGoogleSheet = (collectionName, data) => {
  // This I got from Postman
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const d = {...data};
  
  // Just adding some more informational data for the Spreadsheet
  d.collectionName = collectionName;

  console.dir(d);

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

const CustDetails = ({ className, ...rest }) => {
  const classes = useStyles();
 
  // if the record was successfully written to database
  const [submitted, setSubmitted] = useState(null);

  const [values, setValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoggedIn, addCustomerRecord } = useContext(AppContext);

  useEffect(()=>{
    // Default values for the Form
    setValues({
      name: 'Katarina',
      phone: '5611231234',
      email: 'demo@devias.io',
      avatarUrl: 'av',
      createdAt: new Date(Date.now()),
      street: '123',
      city: 'Boca Raton',
      state: 'Florida',
      country: 'USA'
    });
  },[]);

  // HANDLERS
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

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

  const addCustomer = ({event, naam}) => {
    console.warn(`In saveCustomer() - event is ${event} - naam is ${naam}`);
    setAddButtonDisabled(true);

    // data to be written to Firestore --- checkout how we are dealing with address
    const data = {
      name: naam ? naam : values.name,
      phone: values.phone,
      email: values.email,
      avatarUrl: values.avatarUrl,
      address : {
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country
      }      
    };

    const user = isLoggedIn;

    if (user != null) {
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    }

    // INSERT customer record in database   
      data.createdAt = Date.now();
      data.uid = isLoggedIn.uid;  // user id of the logged-in user
      
      data.status = "A";          // Active
      // data.strength
      // data.stressor
      data.ss = [
        {date: null, strength: null, stressor: null},
        {},
        {}
      ];
      /*
      data.kids = [
        {name: 'kid1', age: 10},
        {name: 'kid2', age: 11},
        {name: 'kid3', age: 12},
      ];
      */
      data.serviceCompletion = "N";
      data.rating = null;

      CustomerDataService.create(data)
        .then((docRef) => {
          console.log(`cust id just created in database is ${docRef.id}`);
          setSubmitted(`cust id just created in database is ${docRef.id}`);
          
          // add the record to cache 
          data.id = docRef.id;
          addCustomerRecord(data); 
          showSnackbar(`Successfully added customer ${docRef.id}`);

          return makeEntryInGoogleSheet('customers', data);
        })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((e) => {
          console.log(e.message);
          setIsError(e.message);
        });
    setAddButtonDisabled(false);
    
  }; // addCustomer()

  // RETURN AREA --------------------------------------------------------------------

  // Error
  if (isError){
    return (
      <div>
       <Alert severity="error">{isError}</Alert>
      </div>
    );
  }

  // Successfully added Customer record in database
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
          {/*
          <Card>
          <CardHeader
            subheader="Info only"
            title="Case Summary"
          />
          <Divider />
          <CardContent>
            <div>{ 'Created On: ' + new Date(values.createdAt).toLocaleString() }</div>
            { values.updatedAt ? <span>{'Last Modified On: ' + new Date(values.updatedAt).toLocaleString()}</span> : null }
          </CardContent>
          </Card>
          &nbsp;
          */}
          <Card
          elevation={5}>
          <CardHeader
            subheader="The information can be edited"
            title="Case Details"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the Name"
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Street"
                name="street"
                onChange={handleChange}
                required
                value={values.street}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select State"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
                variant="outlined"
              >
                {states.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            disabled={addButtonDisabled}
            onClick={ (event)=>{addCustomer({event, naam:null});} }
          >
            Add Case
          </Button>
        </Box>
      </Card>
    </form>
  </>
  );
};

CustDetails.propTypes = {
  className: PropTypes.string
};

export default CustDetails;
