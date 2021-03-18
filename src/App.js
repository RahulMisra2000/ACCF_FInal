import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import firebaseProducts from 'src/config/firebaseConfig';

const { auth } = firebaseProducts;

const App = () => {
  const routing = useRoutes(routes);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      const { uid } = user;
      console.log('user logged in', uid);
      console.dir(user);
    } else {
      console.log('user logged out');
    }
    setIsLoggedIn(user);
    console.log(isLoggedIn);
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
