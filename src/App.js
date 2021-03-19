import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import firebaseProducts from 'src/config/firebaseConfig';
import userContext from 'src/contexts/userContext';
import { SnackbarProvider } from 'notistack';

const { auth } = firebaseProducts;
console.log('%cIn App.js but outside component', 'background-Color:black; color:white');

// Up till here executed just ONCE
const App = () => {
  console.log('%cMounting App', 'background-Color:red; color:white');

  const routing = useRoutes(routes);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsLoggedIn(user); // user.id contains the unique user id
    });
  }, []);

  return (
    <userContext.Provider value={isLoggedIn}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SnackbarProvider maxSnack={3}>
          {routing}
        </SnackbarProvider>
      </ThemeProvider>
    </userContext.Provider>
  );
};

export default App;
