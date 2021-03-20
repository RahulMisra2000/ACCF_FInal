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

// Initializing the Context --------------------------------------------
// with data
let appContextData = { isLoggedIn: null, cArray: [] };

// with methods (Consumers of context can call these methods)
appContextData.populateCustomerArray = (carray) => {
  appContextData.cArray = [...carray];
};

appContextData.addCustomerRecord = (crec) => {
  appContextData.cArray.unshift(crec);
};

appContextData.updCustomerRecord = (crec) => {
  let found = false;
  const a = appContextData.cArray.filter((v) => {
    found = true;
    return !(crec.id === v.id);
  });

  if (found) {
    a.unshift(crec);
    appContextData.cArray = [...a];
  }
};

appContextData.invalidateCache = () => {
  appContextData.cArray = [];
};
// Initializing the Context --------------------------------------------

console.log('%cIn App.js but outside component', 'background-Color:black; color:white');

// FROM TOP UP UNTIL THIS LINE IS EXECUTED JUST *** ONCE *** FOR THE ENTIRE RUN OF THE APPLICATION
const App = () => {
  console.log('%cMounting App', 'background-Color:red; color:white');

  const routing = useRoutes(routes);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log('****', appContextData);
      appContextData = { ...appContextData, isLoggedIn: user };
      // Have to change state so that there is a cascade of re-rendering
      // I am placing the entire user object in isLoggedIn property and not just whether
      // the user is logged in or not (ie a boolean)
      setIsLoggedIn(user); // user.id contains the unique user id

      // This so that any component that consumes the context can get to these values
      console.log('****', appContextData);
      console.log(isLoggedIn);
    });
  });

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
