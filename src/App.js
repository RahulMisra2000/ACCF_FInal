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

console.log('%c1st line of App.js just executed', 'background-Color:black; color:white');
console.log(process.env.REACT_APP_SHELL_1);
console.log(process.env.REACT_APP_COMING_FROM_ENV_FILE);

const { auth } = firebaseProducts;

// ----------------- Initializing the Context --------------------------------------------
// with data
let appContextData = { isLoggedIn: null, claims: {}, cArray: [] };

// with methods (Consumers of context can call these methods)
appContextData.populateCustomerArray = (carray) => {
  // appContextData.cArray = [...carray];
  appContextData.cArray = carray.map((v) => {
    const obj = { ...v }; // 1st level properties will be copied
    // There are two arrays (children and ss) that will need to be handled
    obj.children = v.children.map((v1) => {
      return { ...v1 };
    });
    obj.ss = v.ss.map((v2) => {
      return { ...v2 };
    });
    return obj;
  });
};

appContextData.addCustomerRecord = (crec) => {
  const obj = { ...crec };
  obj.children = crec.children.map((v1) => {
    return { ...v1 };
  });
  obj.ss = crec.ss.map((v2) => {
    return { ...v2 };
  });
  appContextData.cArray.unshift(obj);
};

// only phone and email fields can be updated for the customer (aka case management record)
appContextData.updCustomerRecord = (crec) => {
  const a = appContextData.cArray.map((v) => {
    if (crec.id === v.id) {
      return { ...v, phone: crec.phone, email: crec.email };
    }
    return { ...v };
  });
  appContextData.cArray = [...a];
};

// Add strength and stressor pair(objToAdd) into the ss array of the customer record(cid)
appContextData.addStrengthStressorPair = (cid, objToAdd) => {
  console.log('here');
  console.dir(objToAdd);
  const a = appContextData.cArray.map((v) => {
    if (cid === v.id) {
      return { ...v, ss: [...v.ss, { ...objToAdd }] };
    }
    return { ...v };
  });
  appContextData.cArray = [...a];

  console.dir(appContextData.cArray);
};

// Add Child to children array
appContextData.addChildInCache = (cid, objToAdd) => {
  console.log('here');
  console.dir(objToAdd);
  const a = appContextData.cArray.map((v) => {
    if (cid === v.id) {
      return { ...v, children: [...v.children, { ...objToAdd }] };
    }
    return { ...v };
  });
  appContextData.cArray = [...a];

  console.dir(appContextData.cArray);
};

//
appContextData.invalidateCache = () => {
  appContextData.cArray = [];
};
// ----------------- Initializing the Context --------------------------------------------

// FROM TOP UP UNTIL THIS LINE IS EXECUTED JUST *** ONCE *** FOR THE ENTIRE RUN OF THE APPLICATION
const App = () => {
  console.log('%cApp component code just executed', 'color:blue');

  const routing = useRoutes(routes);
  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [forceRepaint, setForceRepaint] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // user.uid will contain the unique user id or null

      // user.getIdTokenResult() returns an object which has
      // properties (claims, issued time, expiration time, etc)
      // https://firebase.google.com/docs/reference/js/firebase.auth.IDTokenResult
      // Just remember that if the user is signed out then user is null

      appContextData = { ...appContextData, isLoggedIn: user };
      // Have to change state so that there is a cascade of re-rendering
      // I am placing the entire user object in isLoggedIn property and not just whether
      // the user is logged in or not (ie a boolean)
      // Remember that setting the state is an async execution

      if (user) {
        user.getIdTokenResult()
          .then((details) => {
            appContextData = { ...appContextData, claims: { ...details.claims } };
            console.log(Date.now());
            setIsLoggedIn(user); // async operation
          });
      } else {
        appContextData = { ...appContextData, claims: {} };
        setIsLoggedIn(user); // async operation
      }
    });
    return () => unsubscribe();
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
