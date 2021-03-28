import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
// import routes from 'src/routes';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';
import { SnackbarProvider } from 'notistack';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';

console.log('%c1st line of App.js just executed', 'background-Color:black; color:white');
console.log(process.env.REACT_APP_SHELL_1);
console.log(process.env.REACT_APP_COMING_FROM_ENV_FILE);

const { auth } = firebaseProducts;

// ----------------- Initializing the Context --------------------------------------------
// with data
let appContextData = {
  isLoggedIn: null,
  signedInUsersEmail: '',
  claimsInJwt: {},
  cArray: [],
  rArray: []
};

// WITH METHODS
// REFERRALS
appContextData.populateReferralArrayToCache = (rarray) => {
  appContextData.rArray = rarray.map((v) => {
    const obj = { ...v }; // 1st level properties will be copied
    // There is one array (followup) that will need to be handled
    obj.followup = v.followup.map((v1) => {
      return { ...v1 };
    });
    return obj;
  });
};

appContextData.addReferralRecordToCache = (rrec) => {
  const obj = { ...rrec };
  obj.followup = rrec.followup.map((v1) => {
    return { ...v1 };
  });
  appContextData.rArray.unshift(obj);
};

appContextData.addFollowupInCache = (rid, objToAdd) => {
  const a = appContextData.rArray.map((v) => {
    if (rid === v.id) {
      return { ...v, followup: [...v.followup, { ...objToAdd }] };
    }
    return { ...v };
  });
  appContextData.rArray = [...a];
};

// CUSTOMERS
appContextData.populateCustomerArrayToCache = (carray) => {
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

appContextData.addCustomerRecordToCache = (crec) => {
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
appContextData.updCustomerRecordToCache = (crec) => {
  const a = appContextData.cArray.map((v) => {
    if (crec.id === v.id) {
      return { ...v, phone: crec.phone, email: crec.email };
    }
    return { ...v };
  });
  appContextData.cArray = [...a];
};

// Add strength and stressor pair(objToAdd) into the ss array of the customer record(cid)
appContextData.addStrengthStressorToCache = (cid, objToAdd) => {
  const a = appContextData.cArray.map((v) => {
    if (cid === v.id) {
      return { ...v, ss: [...v.ss, { ...objToAdd }] };
    }
    return { ...v };
  });
  appContextData.cArray = [...a];
};

// Add Child to children array
appContextData.addChildInCache = (cid, objToAdd) => {
  const a = appContextData.cArray.map((v) => {
    if (cid === v.id) {
      return { ...v, children: [...v.children, { ...objToAdd }] };
    }
    return { ...v };
  });
  appContextData.cArray = [...a];
};

//
appContextData.invalidateCache = () => {
  appContextData.cArray = [];
  appContextData.rArray = [];
};
// ----------------- Initializing the Context --------------------------------------------

// FROM TOP UP UNTIL THIS LINE IS EXECUTED JUST *** ONCE *** FOR THE ENTIRE RUN OF THE APPLICATION
const App = () => {
  console.log('%cApp component code just executed', 'background-Color:blue; color:white');

  // const routing = useRoutes(routes);

  // Entire purpose of the forceRender state definition is so that the entire component tree can
  // re-render when the state changes.
  // eslint-disable-next-line no-unused-vars
  const [forceRender, setForceRender] = useState(null);

  useEffect(() => {
    const unsubscribe1 = auth.onAuthStateChanged((user) => {
      // Make sure that you fill up the appContext with all the values and ONLY THEN set the
      // forceRender state so that all downstream components can get the latest appContext values
      // user.uid will contain the unique user id or null

      // user.getIdTokenResult() returns an object which has
      // properties (claims, issued time, expiration time, etc)
      // https://firebase.google.com/docs/reference/js/firebase.auth.IDTokenResult
      // Just remember that if the user is signed out then user is null

      appContextData = { ...appContextData, isLoggedIn: user };
      // Have to change state so that there is a cascade of re-rendering
      // I am placing the entire user object in isLoggedIn property and not just whether
      // the user is logged in or not (ie a boolean)
      // ALWAYS Remember that setting the state is an async execution

      if (user) {
        // Get the email of the signed-in user REGARDLESS of which Provider
        // he may have used to signin
        user.providerData.forEach((profile) => {
          /*
          console.log(`Sign-in provider: ${profile.providerId}`);
          console.log(`Provider-specific UID: ${profile.uid}`);
          console.log(`Name: ${profile.displayName}`);
          console.log(`Email: ${profile.email}`);
          console.log(`Photo URL: ${profile.photoURL}`);
          */
          appContextData = { ...appContextData, signedInUsersEmail: profile.email };
        });

        // Get claims from JWT
        user.getIdTokenResult()
          .then((details) => {
            appContextData = { ...appContextData, claimsInJwt: { ...details.claims } };
            setForceRender(user); // async operation
          })
          .catch((e) => {
            console.log(`Error getIdTokenResult ${e.message} ${Date.now()}`);
          });
      } else {
        appContextData = { ...appContextData, claimsInJwt: {} };
        setForceRender(user); // async operation
      }
    });

    const unsubscribe2 = window.setInterval(() => {
      console.log('%cCustomer\'s Array Cached Content Follows', 'color:green');
      console.log(appContextData.cArray);
      console.log('%cCustomer\'s Referral Array Cached Content Follows', 'color:green');
      console.log(appContextData.rArray);
      console.log('%cApplication\'s AppContextData Follow', 'color:green');
      console.dir(appContextData);
    }, 10000);

    return () => {
      unsubscribe1();
      window.clearInterval(unsubscribe2);
    };
  }, []);

  return (
    <AppContext.Provider value={appContextData}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SnackbarProvider maxSnack={3}>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
            <Route path="app/*" element={<DashboardLayout />} />
            {/* <Route path="app/*" render={() => (<DashboardLayout />)} /> */}
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
