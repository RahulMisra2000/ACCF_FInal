/* eslint-disable */
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import firebaseProducts from 'src/config/firebaseConfig';

const { auth } = firebaseProducts;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  let loginErrorMessage = null;

  const handleSubmitF = (e, values) => {
    console.log('%handleSubmitF', 'color:red');
    console.log(e, values);
  };

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'b@b.com',
              password: '123456'
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            validate={(values) => {
              // Here we can validate the individual fields of the forms if we wanted to
              // https://formik.org/docs/guides/validation
              console.log(values);
            }}
            onSubmit={(values, { setSubmitting, resetForm}) => {
              console.log('onSubmit');
              
              if (values.btnClicked === 'GOOGLE') {
                auth.signInWithPopup(firebaseProducts.googleProvider).then(function(result) {
                  // This gives you a Google Access Token.
                  var token = result.credential.accessToken;
                  // The signed-in user info.
                  var user = result.user;
                  console.log(result);
                  navigate('/app/dashboard', { replace: true });
                 })
                 .catch((error) => {
                  loginErrorMessage = `${error.message}`;
                  setSubmitting(false);
                });  
              } else if (values.btnClicked === 'FB') {
                  auth.signInWithPopup(firebaseProducts.facebookProvider).then(function(result) {
                    navigate('/app/dashboard', { replace: true });
                  })
                  .catch((error) => {
                    loginErrorMessage = `${error.message}`;
                    setSubmitting(false);
                  });  
                } else if (values.btnClicked === 'EP') {
                  console.log('%c' + values, 'color:red');
                    auth.signInWithEmailAndPassword(values.email, values.password)
                    .then((userCredential) => {
                      // Signed in
                      // const user = userCredential.user;
                      console.log(userCredential);
                      navigate('/app/dashboard', { replace: true });
                    })
                    .catch((error) => {
                      loginErrorMessage = `${error.message}`;
                      setSubmitting(false);
                    });
              }
            }}
          >
            { 
              // https://github.com/formium/formik/issues/1865
              (helpers) => { 
                const { errors,handleBlur,handleChange,handleSubmit,isSubmitting,touched,values } = helpers;
                
                return (
                  <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
                  
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={(e) => { helpers.setFieldValue('btnClicked','GOOGLE'); }}
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Login with Google
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      fullWidth
                      startIcon={<FacebookIcon />}
                      onClick={(e) => { helpers.setFieldValue('btnClicked','FB'); }}
                      size="large"
                      variant="contained"
                      type="submit"
                    >
                      Login with Facebook
                    </Button>
                  </Grid>

                </Grid>
                <Box
                  mt={3}
                  mb={1}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={(e) => { helpers.setFieldValue('btnClicked','EP'); }}
                    type="submit"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
                {loginErrorMessage 
                    ?
                      (
                        <div>
                          { loginErrorMessage }
                        </div>
                      )
                  : 
                    null}
              </form>
                )}
            }
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
