import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import HackViewForMainLayout from 'src/HACK/HackViewForMainLayout';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const MainLayout = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBar />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Routes>
              {/* Wrote HackView because I couldn't get Link from react-router-dom ver 6 to work */}
              <Route path="" element={<HackViewForMainLayout loc="/login" />} />
              <Route path="login" element={<LoginView />} />
              <Route path="register" element={<RegisterView />} />
              <Route path="404" element={<NotFoundView />} />
              <Route path="*" element={<HackViewForMainLayout loc="/404" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
