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
import { date } from 'yup';

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

const CustDetails = ({ className, ...rest }) => {
  const classes = useStyles();
 
  // if the record was successfully written to database
  const [submitted, setSubmitted] = useState(null);

  const [values, setValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoggedIn, addCustomerRecord } = useContext(AppContext);

  // UTILITY FUNCTIONS
  const getDefaultValuesForForm = () => {
    return {
      name: '',
      phone: '',
      email: '',
      crisis: "No",
      k1name: '', k1age:'', k1grade:'', k1school:'',
      k2name: '', k2age:'', k2grade:'', k2school:'',
      k3name: '', k3age:'', k3grade:'', k3school:'',
      k4name: '', k4age:'', k4grade:'', k4school:'',
      strengthScore: '',
      stressorScore: '',
      errors: {}
    };
  };

  
  useEffect(()=>{
    setValues(getDefaultValuesForForm());    
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

  const formFailsValidation = () => {
    let atLeastOneValidationFailed = false;
    let errorsObject = {};

    if (!Boolean(values.name?.trim())) {                // validate name
      errorsObject.name = 'Name cannot be blank';
      atLeastOneValidationFailed = true;
    } 

    if (!["Yes", "No"].includes(values.crisis)){        // validate crisis
      errorsObject.crisis = 'Must be Yes or No';      
      atLeastOneValidationFailed = true;
    }

    if (!values.email.match((/^([a-z0-9_\.-]+\@[\da-z-]+\.[a-z\.]{2,6})$/))){   // validate email
      errorsObject.email = 'Invalid Email Format';      
      atLeastOneValidationFailed = true;
    }

    if (!values.phone.match(/^\W?\d*?\W*?(?<area>\d{3})\W*?(?<group1>\d{3})\W*?(?<group2>\d{4})\W*?$/)){  // validate phone
      errorsObject.phone = 'Invalid Phone Format';      
      atLeastOneValidationFailed = true;
    }

    if (!Number(values.strengthScore) || Number(values.strengthScore) < 0) { // validate strengthScore
      errorsObject.strengthScore = 'Only Positive Numbers';      
      atLeastOneValidationFailed = true;
    }

    if (!Number(values.stressorScore) || Number(values.stressorScore) < 0) { // validate stressorScore
      errorsObject.stressorScore = 'Only Positive Numbers';      
      atLeastOneValidationFailed = true;
    }

    if (values.k1name && (!Number(values.k1age) || !values.k1grade || !values.k1school || values.k1grade == 'Select' || values.k1school == 'Select')){
      errorsObject.k1name = `Enter age, grade and school for ${values.k1name}`;      
      atLeastOneValidationFailed = true;
    }

    if (values.k2name && (!Number(values.k2age) || !values.k2grade || !values.k2school || values.k2grade == 'Select' || values.k2school == 'Select')){
      errorsObject.k2name = `Enter age, grade and school for ${values.k2name}`;      
      atLeastOneValidationFailed = true;
    }

    if (values.k3name && (!Number(values.k3age) || !values.k3grade || !values.k3school || values.k3grade == 'Select' || values.k3school == 'Select')){
      errorsObject.k3name = `Enter age, grade and school for ${values.k3name}`;      
      atLeastOneValidationFailed = true;
    }

    if (values.k4name && (!Number(values.k4age) || !values.k4grade || !values.k4school || values.k4grade == 'Select' || values.k4school == 'Select')){
      errorsObject.k4name = `Enter age, grade and school for ${values.k4name}`;      
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

  const addCustomer = ({event, naam}) => {
    setAddButtonDisabled(true); // To prevent them from firing this multiple times

    // VALIDATE THE FORM NOW
    if (formFailsValidation()) {
      setAddButtonDisabled(false);
      return;
    }

    const creationMoment = Date.now();
    // Take data from Form and write to an object --- PREPARING DATA to be written to Firestore
    // Data coming from the Form
    const data = {
      name: naam ? naam : values.name,
      phone: values.phone,
      email: values.email,
      crisis: values.crisis,    
      children: (() => {
        const arr = [];
        if (values.k1name) { arr.push({name: values.k1name, age: values.k1age, grade: values.k1grade, school: values.k1school }); } 
        if (values.k2name) { arr.push({name: values.k2name, age: values.k2age, grade: values.k2grade, school: values.k2school }); } 
        if (values.k3name) { arr.push({name: values.k3name, age: values.k3age, grade: values.k3grade, school: values.k3school }); } 
        if (values.k4name) { arr.push({name: values.k4name, age: values.k4age, grade: values.k4grade, school: values.k4school }); } 
        return arr;          
      })(),
      ss: [
        {date: creationMoment, strength: values.strengthScore, stressor: values.stressorScore}
      ]     
    };

    // Other data not coming from the form
    data.createdAt = creationMoment;
    data.uid = isLoggedIn.uid;  // user id of the logged-in user
    data.status = "Open";          // Open
    data.serviceCompletion = "N";
    data.rating = null;

    // INSERT customer record in database   
      CustomerDataService.create(data)
        .then((docRef) => {
          console.log(`cust id just created in database is ${docRef.id}`);
          setSubmitted(`cust id just created in database is ${docRef.id}`);
          
          // add the record to cache 
          data.id = docRef.id;
          addCustomerRecord(data);
          showSnackbar(`Successfully added customer ${docRef.id}`);

          return makeEntryInGoogleSheet('customers', {...data});
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
console.log('----------------------------------------------------');

console.dir(values);

  // SHOW THE FORM
  return (
    <>
        <form
          autoComplete="off"
          noValidate
          className={clsx(classes.root, className)}
          {...rest}
        >          
          {/* Parent Details */}
          <Card elevation={5}>
            <CardHeader subheader="Parent Information" title="Case Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth label="Name" name="name" onChange={handleChange} required value={values.name} variant="outlined" size="small" 
                    error={values?.errors?.name ? true : false}
                    helperText={values?.errors?.name ? values?.errors?.name : ''}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth label="Crisis" name="crisis" onChange={handleChange} required value={values.crisis} variant="outlined" size="small" 
                    error={values?.errors?.crisis ? true : false}
                    helperText={values?.errors?.crisis ? values?.errors?.crisis : ''}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth label="Email" name="email" onChange={handleChange} required value={values.email} variant="outlined" size="small"
                    error={values?.errors?.email ? true : false}
                    helperText={values?.errors?.email ? values?.errors?.email : ''}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth label="Phone Number" name="phone" onChange={handleChange} value={values.phone} variant="outlined" size="small"
                   error={values?.errors?.phone ? true : false}
                   helperText={values?.errors?.phone ? values?.errors?.phone : ''}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          &nbsp;

          {/* Strength & Stressor */}
          <Card elevation={5}>
            <CardHeader subheader="Strength & Stressor Scores" />
            <Divider />
            <CardContent>
              <Grid container spacing={3} >
                <Grid item sm={6} xs={12} >
                  <TextField fullWidth label="Strength Score" name="strengthScore" onChange={handleChange} required value={values.strengthScore} variant="outlined" size="small" 
                    error={values?.errors?.strengthScore ? true : false}
                    helperText={values?.errors?.strengthScore ? values?.errors?.strengthScore : ''}
                  />
                </Grid>
                <Grid item sm={6} xs={12} >
                  <TextField fullWidth label="Stressor Score" name="stressorScore" onChange={handleChange} required value={values.stressorScore} variant="outlined" size="small" 
                    error={values?.errors?.stressorScore ? true : false}
                    helperText={values?.errors?.stressorScore ? values?.errors?.stressorScore : ''}
                  />
                </Grid>              
             </Grid>
            </CardContent>
          </Card>          
          &nbsp;
          
          {/* Kid Details */}
          <Card elevation={5}>
            <CardHeader subheader="Children's Information" />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
 
                {/* 1st child */}
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Name" name="k1name" onChange={handleChange} value={values.k1name} variant="outlined" size="small"
                    error={values?.errors?.k1name ? true : false}
                    helperText={values?.errors?.k1name ? values?.errors?.k1name : ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Age" name="k1age" onChange={handleChange} value={values.k1age} variant="outlined" size="small" />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Grade" name="k1grade" onChange={handleChange}  
                    select SelectProps={{ native: true }} value={values.k1grade} variant="outlined" size="small" > 
                    {dataForSelect.childGradeLevel.map((option) => (
                      <option key={option.code} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>              
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="School" name="k1school" onChange={handleChange} 
                    select SelectProps={{ native: true }} value={values.k1school} variant="outlined" size="small"             
                  > 
                    {dataForSelect.childSchool.map((option) => (
                      <option key={option.code} value={option.name} >
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                
                {/* 2nd child */}
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Name" name="k2name" onChange={handleChange} value={values.k2name} variant="outlined" size="small"
                    error={values?.errors?.k2name ? true : false}
                    helperText={values?.errors?.k2name ? values?.errors?.k2name : ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Age" name="k2age" onChange={handleChange} value={values.k2age} variant="outlined" size="small" />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Grade" name="k2grade" onChange={handleChange} 
                    select SelectProps={{ native: true }} value={values.k2grade} variant="outlined" size="small" > 
                    {dataForSelect.childGradeLevel.map((option) => (
                      <option key={option.code} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>              
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="School" name="k2school" onChange={handleChange} 
                    select SelectProps={{ native: true }} value={values.k2school} variant="outlined" size="small"             
                  > 
                    {dataForSelect.childSchool.map((option) => (
                      <option key={option.code} value={option.name} >
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                {/* 3rd child */}
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Name" name="k3name" onChange={handleChange}  value={values.k3name} variant="outlined" size="small"
                    error={values?.errors?.k3name ? true : false}
                    helperText={values?.errors?.k3name ? values?.errors?.k3name : ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Age" name="k3age" onChange={handleChange}  value={values.k3age} variant="outlined" size="small" />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Grade" name="k3grade" onChange={handleChange}  
                    select SelectProps={{ native: true }} value={values.k3grade} variant="outlined" size="small" > 
                    {dataForSelect.childGradeLevel.map((option) => (
                      <option key={option.code} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>              
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="School" name="k3school" onChange={handleChange} 
                    select SelectProps={{ native: true }} value={values.k3school} variant="outlined" size="small"             
                  > 
                    {dataForSelect.childSchool.map((option) => (
                      <option key={option.code} value={option.name} >
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                {/* 4th child */}
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Name" name="k4name" onChange={handleChange}  value={values.k4name} variant="outlined" size="small"
                    error={values?.errors?.k4name ? true : false}
                    helperText={values?.errors?.k4name ? values?.errors?.k4name : ''}
                  />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Age" name="k4age" onChange={handleChange}  value={values.k4age} variant="outlined" size="small" />
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="Grade" name="k4grade" onChange={handleChange}  
                    select SelectProps={{ native: true }} value={values.k4grade} variant="outlined" size="small" > 
                    {dataForSelect.childGradeLevel.map((option) => (
                      <option key={option.code} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>              
                </Grid>
                <Grid item sm={3} xs={12} >
                  <TextField fullWidth label="School" name="k4school" onChange={handleChange} 
                    select SelectProps={{ native: true }} value={values.k4school} variant="outlined" size="small"             
                  > 
                    {dataForSelect.childSchool.map((option) => (
                      <option key={option.code} value={option.name} >
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
      
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button color="primary" variant="contained" disabled={addButtonDisabled} onClick={ (event)=>{addCustomer({event, naam:null});} }>
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
