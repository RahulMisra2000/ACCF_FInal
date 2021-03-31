/* eslint-disable */
import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, makeStyles, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import Zoom from '@material-ui/core/Zoom';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import CRUDService from 'src/services/CRUDService';
import AppContext from 'src/contexts/appContext';
import dataForSelect from 'src/dataForSelect';

//#region STYLES
const useStyles = makeStyles(() => ({
  root: {},
  rmcard: {
    border: "2px solid #c5cae9"
  },
  rmtypography: {
    display: 'inline-block'
  },
  rm1: {
    marginTop: '14px'
  }
}));
//#endregion

//#region  UTILITY FUNCTION
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
//#endregion

const CustDetails = ({ cid, className, ...rest }) => {
  console.log('%cCustDetails component code (in CustomerUpdate) just executed', 'color:blue');
  const classes = useStyles();

  //#region CONTEXT
  const { isLoggedIn, addStrengthStressorToCache, addChildInCache, updCustomerRecordToCache } = useContext(AppContext);
  //#endregion

  //#region UTILITY
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

  const updateStateWithCustomerDataFromFirestore = (doc) => {            
    setValues({
      // Scalar structures
      id: cid,
      name: doc.data().name,
      crisis: doc.data().crisis,
      phone: doc.data().phone,
      email: doc.data().email,              
      createdAt: new Date(doc.data().createdAt),
      updatedAt: doc.data()?.updatedAt ? doc.data().updatedAt : null,
      uid: doc.data().uid,
      uidEmail: doc.data().uidEmail,
      status: doc.data().status,
      serviceCompletion: doc.data().serviceCompletion,
      rating: doc.data().rating,

      // Nested structures
      children: doc.data()?.children ? doc.data().children : [],
      ss: doc.data()?.ss ? doc.data().ss : [],
      
      // For Adding New Strength and Stressors
      strengthScore: '',
      stressorScore: '',

      // For Adding One Child
      childName: '',
      childAge: '',
      childGrade: '',
      childSchool: '',

      // Errors - For Forms validation
      errors: {}
    });
  };

  const checkFormValuesRelatedToUpdate = () => {
    let atLeastOneValidationFailed = false;
    let errorsObject = {};
    
    if (!values.email.match((/^([a-z0-9_\.-]+\@[\da-z-]+\.[a-z\.]{2,6})$/))){   // validate email
      errorsObject.email = 'Invalid Email Format';      
      atLeastOneValidationFailed = true;
    }

    if (!values.phone.match(/^\W?\d*?\W*?(?<area>\d{3})\W*?(?<group1>\d{3})\W*?(?<group2>\d{4})\W*?$/)){  // validate phone
      errorsObject.phone = 'Invalid Phone Format';      
      atLeastOneValidationFailed = true;
    }
    
    return atLeastOneValidationFailed ? errorsObject : null;
  };

  const checkFormValuesRelatedToSS = () => {
    let atLeastOneValidationFailed = false;
    let errorsObject = {};
    
    if (!Number(values.strengthScore) || Number(values.strengthScore) < 0) {
      errorsObject.strengthScore = 'Only Positive Numbers';      
      atLeastOneValidationFailed = true;
    }

    if (!Number(values.stressorScore) || Number(values.stressorScore) < 0) {
      errorsObject.stressorScore = 'Only Positive Numbers';      
      atLeastOneValidationFailed = true;
    }

    return atLeastOneValidationFailed ? errorsObject : null;
  };

  const checkFormValuesRelatedToChild = () => {   
    let atLeastOneValidationFailed = false;
    let errorsObject = {};
    
    if (!values.childName) {
      errorsObject.childName = `Enter age, grade and school for ${values.childName}`;      
      atLeastOneValidationFailed = true;      
    }

    if (values.childName && (!Number(values.childAge) || !values.childGrade || !values.childSchool || values.childGrade == 'Select' || values.childSchool == 'Select')){
      errorsObject.childName = `Enter age, grade and school for ${values.childName}`;      
      atLeastOneValidationFailed = true;      
    }

    return atLeastOneValidationFailed ? errorsObject : null;
  };
  //#endregion

  //#region STATE
  const [submitted, setSubmitted] = useState(null);
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [updButtonDisable, setUpdButtonDisable] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  //#endregion
  
  //#region UseEffect HOOK - Read Record From Firestore
  useEffect(()=>{
    if (cid){
      setIsLoading(true);

      // READ RECORD FROM FIRESTORE      
      CRUDService.get('customers', cid)
      .then((doc) => {
        if (doc.exists) {
            updateStateWithCustomerDataFromFirestore(doc);            
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
            setIsError(`Document ${cid} does not exist in database`);
        }
      })
      .catch((err) => {
        console.log("Error accessing document:", err);
        setIsError(err.message);
      })
      .finally(()=>{
        setIsLoading(false);
      });
    }  
  },[]);
  //#endregion

  //#region EVENT HANDLERS
 
  //#region onChange event handler
  const handleChange = (event) => {
    const { name, value } = event.target;

    // If email or phone fields are changed then enable the update button
    if (['email', 'phone'].includes(name)) {
      setUpdButtonDisable(false);
    }

    setValues({
      ...values,
      [name]: value
    });
  };
  //#endregion

  //#region Update Button Click Event Handler
  const handleUpdCustomer = ({event, cid}) => {
    setUpdButtonDisable(true);

    // VALIDATION
    const errorsObject = checkFormValuesRelatedToUpdate(); 
    if (errorsObject) {
      setValues({...values, errors : {...errorsObject}});   // add all the errors to the state      
      return;
    }

    // data : will contain the stuff that will be sent to Firestore for update
    // Only these fields can be updated so, get them from the state which we have setup as the SINGLE SOURCE OF TRUTH
    // by doing coding onChange= and value= properties of the Form Fields
    const data = {
      phone: values.phone,
      email: values.email,
      updatedAt : Date.now()
     };

    // UPDATE FIRESTORE - only send what needs to be updated
    CRUDService.update('customers', cid, data)
      .then(() => {
        // WILL LATER (since state updates are async) SHOW ON-SCREEN MESSAGE
        setSubmitted(`Customer ${cid} was just updated in database`);

        // UPDATE IN CACHE
        data.id = cid;
        updCustomerRecordToCache(data); 

        // SHOW POPUP NOTIFICATION
        showSnackbar(`Successfully updated customer ${cid}`);

        // WRITE TO SPREADSHEET
          // If you enable this then you will need to do these two before the catch if 
          // you want to log out the response from the App Script
          // .then((response) => response.text())
          // .then((result) => console.log(result))  
          // return makeEntryInGoogleSheet('customers', {...data});
      })
      .catch((e) => {
        // https://firebase.google.com/docs/reference/js/firebase.firestore#firestoreerrorcode
        console.log('%c' + `Error Name: ${e.name} Code: ${e.code} Message: ${e.message}`, 'color:red');        
        setIsError(`Error updating case: ${e.message}. Please try again`);
      });

    setUpdButtonDisable(false);
  };
  //#endregion

  //#region Add Button Click Event Handler for Strength and Stressor
  const addStrengthStressor = ({event, cid}) => {    
    const now = Date.now();

    // VALIDATION
    const errorsObject = checkFormValuesRelatedToSS();
    
    if (errorsObject) {
      setValues({...values, errors : {...errorsObject}});   // add all the errors to the state      
      return;
    }

    // PREPARE DATA
    // old array : values.ss
    const strengthStressorPairThatNeedsToBeAdded = {date: now, strength: values.strengthScore, stressor: values.stressorScore};
    const newCompleteSSArray = [...values.ss, strengthStressorPairThatNeedsToBeAdded ];
    
    // UPDATE FIRESTORE
    // I think when you want to update an array in Firestore you need to send the entire complete array and not just the element that 
    // you want added into the array
    CRUDService.update('customers', cid, {ss: newCompleteSSArray})
      .then(() => {
        // UPDATE CACHE
        addStrengthStressorToCache(cid, strengthStressorPairThatNeedsToBeAdded);

        // SCREEN NOTIFICATION
        setSubmitted(`Customer ${cid} was just updated in database`);

        // POPUP NOTIFICATION
        showSnackbar(`Successfully updated customer ${cid}`);        

        // CLEAR OUT ERRORS
        setValues({...values, errors : {}});
      })
      .then((result) => console.log(result))
      .catch((e) => {        
        setIsError(`Error while adding Strength & Stressor - Message: ${e.message}`);
      });   
  };
  //#endregion

  //#region Add Button Click Event Handler for Child
  const addChild = ({event, cid}) => {    
    
    // VALIDATION
    const errorsObject = checkFormValuesRelatedToChild();
    if (errorsObject) {
      setValues({...values, errors : {...errorsObject}});   // add all the errors to the state      
      return;
    }

    // PREPARE DATA
    const childThatNeedsToBeAdded = {name: values.childName, age: values.childAge, grade: values.childGrade, school: values.childSchool};
    const newCompleteChildrenArray = [...values.children, childThatNeedsToBeAdded ];
    
    console.dir(values.children);
    console.dir(newCompleteChildrenArray);
    
    // UPDATE FIRESTORE    
    // I think when you want to update an array in Firestore you need to send the entire complete array and not just the element that 
    // you want added into the array
    CRUDService.update('customers', cid, {children: newCompleteChildrenArray})
      .then(() => {

        // UPDATE CACHE
        addChildInCache(cid, childThatNeedsToBeAdded);

        // SCREEN NOTIFICATION
        setSubmitted(`Customer ${cid} was just updated in database`);

        // POPUP NOTIFICATION
        showSnackbar(`Successfully added child to customer ${cid}`);

        // CLEAR OUT ERRORS
        setValues({...values, errors : {}});
      })
      .then((result) => console.log(result))
      .catch((e) => {
        setIsError(`Error while adding a child - Message: ${e.message}`);
      });   
   
      
  };
  //#endregion

  //#endregion

  //#region RETURN AREA --------------------------------------------------------------------
  // Loading
  if (isLoading){
    return (
      <div>
        <Alert severity="info">Loading data ...</Alert>
      </div>
    );
  }

  // Error
  if (isError){
    return (
      <div>
       <Alert severity="error">{isError}</Alert>
      </div>
    );
  }

  // Successfully saved Customer record in database
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
          <Card elevation={5} className={classes.rmcard}>
          <CardHeader            
            title="CASE SUMMARY"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item sm={5} xs={12}>
                <Typography className={classes.rmtypography} color="textPrimary" variant="body1">Created:&nbsp;</Typography>
                <Typography className={classes.rmtypography} color="textSecondary" variant="body2">
                  { new Date(values.createdAt).toLocaleString() }
                </Typography>

              </Grid>
              <Grid item sm={4} xs={12}>
                <Typography className={classes.rmtypography} color="textPrimary" variant="body1">By:&nbsp;</Typography>
                <Typography className={classes.rmtypography} color="textSecondary" variant="body2">
                  { values.uidEmail }
                </Typography>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.rmtypography} color="textPrimary" variant="body1">Status:&nbsp;</Typography>
                <Typography className={classes.rmtypography} color="textSecondary" variant="body2">
                  { values.status }
                </Typography>
              </Grid>

              <Grid item sm={5} xs={12}>
                <Typography className={classes.rmtypography} color="textPrimary" variant="body1">Last Modified On:&nbsp;</Typography>
                <Typography className={classes.rmtypography} color="textSecondary" variant="body2">
                  { values.updatedAt ? new Date(values.updatedAt).toLocaleString() : null }
                </Typography>
              </Grid>
              <Grid item sm={4} xs={12}>
              </Grid>
              <Grid item sm={3} xs={12}>                
                <Typography className={classes.rmtypography} color="textPrimary" variant="body1">Service Completions:&nbsp;</Typography>
                <Typography className={classes.rmtypography} color="textSecondary" variant="body2">
                { `${values.serviceCompletion}` }
                </Typography>
              </Grid>

              <Grid item sm={5} xs={12}>                
              </Grid>
              <Grid item sm={4} xs={12}>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography className={classes.rmtypography} color="textPrimary" variant="body1">Rating:&nbsp;</Typography>
                <Typography className={classes.rmtypography} color="textSecondary" variant="body2">
                    { ` ${values.rating ? values.rating : 'None'} `}
                </Typography>
              </Grid>                      
            </Grid>
          </CardContent>
          </Card>

          &nbsp;
          <Card elevation={5} className={classes.rmcard}>
          <CardHeader
            title="CASE DETAILS"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
            <Grid
              item
              sm={6}
              xs={12}
            >
              <TextField
                disabled
                fullWidth                
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
            >
              <TextField
                disabled
                fullWidth
                label="Crisis"
                name="crisis"
                onChange={handleChange}
                required
                value={values.crisis}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                required
                name="email"
                onChange={handleChange}
                value={values.email}
                error={values.errors?.email ? true : false}
                helperText={values.errors?.email ? values.errors?.email : ''}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"                
                onChange={handleChange}              
                value={values.phone}
                error={values.errors?.phone ? true : false}
                helperText={values.errors?.phone ? values.errors?.phone : ''}
                variant="outlined"
                size="small"
              />
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
            disabled={updButtonDisable}
            size="small" 
            onClick={ (event)=>{handleUpdCustomer({event, cid});} }
          >
            Update Case
          </Button>
         </Box>
      </Card>
    

      &nbsp;
      {/* Strength & Stressor */}
      <Card elevation={5} className={classes.rmcard}>
        <CardHeader subheader="Strength & Stressor Scores" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} > 
              { values?.ss && values.ss.map((v,i) => 
                (
                  <React.Fragment key={i}>
                    <Grid item sm={4} xs={12} >                    
                      <TextField fullWidth label="Date"
                        value={`${new Date(v.date).toDateString()} ${new Date(v.date).toLocaleTimeString()}`}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item sm={4} xs={12} >
                    <TextField fullWidth label="Strength"
                        value={v.strength}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item sm={4} xs={12} >
                    <TextField fullWidth label="Stressor"
                        value={v.stressor}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                  </React.Fragment>
                ))
              }
              
              <Grid item xs={6} className={classes.rm1} >
                <TextField fullWidth label="Strength Score" name="strengthScore" onChange={handleChange} required value={values.strengthScore} variant="outlined" size="small" 
                  error={values?.errors?.strengthScore ? true : false}
                  helperText={values?.errors?.strengthScore ? values?.errors?.strengthScore : ''}
                />
              </Grid>
              <Grid item xs={6} className={classes.rm1}>
                <TextField fullWidth label="Stressor Score" name="stressorScore" onChange={handleChange} required value={values.stressorScore} variant="outlined" size="small" 
                  error={values?.errors?.stressorScore ? true : false}
                  helperText={values?.errors?.stressorScore ? values?.errors?.stressorScore : ''}
                />

              </Grid>
          </Grid>
        </CardContent>
        <Divider />     
      
        <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="primary" variant="contained" size="small" onClick={ (event)=>{addStrengthStressor({event, cid});} }>
              Add Strength / Stressors
            </Button>
        </Box>
      </Card>          
      
      &nbsp;
      {/* Children */}
      <Card elevation={5} className={classes.rmcard}>
        <CardHeader subheader="Children" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}> 
              { values?.children && values.children.map((v,i) => 
                (
                  <React.Fragment key={i}>
                    <Grid item sm={3} xs={12} >                    
                      <TextField fullWidth label="Name"
                        value={v.name}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item sm={2} xs={12} >
                    <TextField fullWidth label="Age"
                        value={v.age}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item sm={2} xs={12} >
                    <TextField fullWidth label="Grade"
                        value={v.grade}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item sm={5} xs={12} >
                    <TextField fullWidth label="School"
                        value={v.school}
                        variant="outlined"
                        size="small"
                        disabled
                      />
                    </Grid>
                  </React.Fragment>
                ))
              }

              {/* Adding a child */}
              <Grid item sm={3} xs={12}  className={classes.rm1} >
                <TextField fullWidth label="Name" name="childName" onChange={handleChange} value={values.childName} variant="outlined" size="small"
                  error={values?.errors?.childName ? true : false}
                  helperText={values?.errors?.childName ? values?.errors?.childName : ''}
                />
              </Grid>
              <Grid item sm={2} xs={12}  className={classes.rm1} >
                <TextField fullWidth label="Age" name="childAge" onChange={handleChange} value={values.childAge} variant="outlined" size="small" />
              </Grid>
              <Grid item sm={2} xs={12}  className={classes.rm1} >
                <TextField fullWidth label="Grade" name="childGrade" onChange={handleChange}  
                  select SelectProps={{ native: true }} value={values.childGrade} variant="outlined" size="small" > 
                  {dataForSelect.childGradeLevel.map((option) => (
                    <option key={option.code} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </TextField>              
              </Grid>
              <Grid item sm={5} xs={12}  className={classes.rm1} >
                <TextField fullWidth label="School" name="childSchool" onChange={handleChange} 
                  select SelectProps={{ native: true }} value={values.childSchool} variant="outlined" size="small"             
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
        <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
        >
            <Button
              color="primary"
              variant="contained"
              size="small"   
              onClick= { (event)=>{addChild({event, cid});} }
            >
              Add Child
            </Button>
        </Box>
      </Card>   

    </form>
  </>
  );
  //#endregion
};

CustDetails.propTypes = {
  className: PropTypes.string
};

export default CustDetails;
