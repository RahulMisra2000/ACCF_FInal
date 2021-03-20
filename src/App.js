import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';
import { SnackbarProvider } from 'notistack';

const { auth } = firebaseProducts;

// Initialize the context data
// with data
let appContextData = { isLoggedIn: null, cArray: [] };

// with methods (Consumers of context can call this method to populate the array)
appContextData.populateCustomerArray = (carray) => {
  appContextData.cArray = [...carray];
};

appContextData.addCustomerRecord = (c) => {
  appContextData.cArray.unshift(c);
};

appContextData.updCustomerRecord = (c) => {
  let found = false;
  const a = appContextData.cArray.filter((v) => {
    found = true;
    return !(c.id === v.id);
  });

  if (found) {
    a.unshift(c);
    appContextData.cArray = [...a];
  }

  console.log(appContextData.cArray);
};

console.log('%cIn App.js but outside component', 'background-Color:black; color:white');

// FROM TOP UP UNTIL THIS LINE IS EXECUTED JUST *** ONCE *** FOR THE ENTIRE RUN OF THE APPLICATION
const App = () => {
  console.log('%cMounting App', 'background-Color:red; color:white');

  const routing = useRoutes(routes);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // Have to change state so that there is a cascade of re-rendering
      // I am placing the entire user object in isLoggedIn property and not just whether
      // the user is logged in or not (ie a boolean)
      setIsLoggedIn(user); // user.id contains the unique user id

      // This so that any component that consumes the context can get to these values
      appContextData = { ...appContextData, isLoggedIn };
    });
  }, []);

  return (
    <AppContext.Provider value={appContextData}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SnackbarProvider maxSnack={3}>
          {routing}
        </SnackbarProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
