import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import ProductListView from 'src/views/product/ProductListView';
import SettingsView from 'src/views/settings/SettingsView';
import CustomerAddView from 'src/views/customer/CustomerAddView';
import CustomerUpdateView from 'src/views/customer/CustomerUpdateView';
import ReferralListView from 'src/views/referrals/ReferralListView';
import ReferralAddView from 'src/views/referrals/ReferralAddView';
import ReferralUpdateView from 'src/views/referrals/ReferralUpdateView';
import HackViewForDashboardLayout from 'src/HACK/HackViewForDashboardLayout';

import NavBar from './NavBar';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
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

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Routes>
              <Route path="" element={<DashboardView />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="customers" element={<CustomerListView />} />
              <Route path="referrals" element={<ReferralListView />} />
              <Route path="referrals/add" element={<ReferralAddView />} />
              <Route path="referrals/upd/:id" element={<ReferralUpdateView />} />
              <Route path="account" element={<AccountView />} />
              <Route path="products" element={<ProductListView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="customers/add" element={<CustomerAddView />} />
              <Route path="customers/upd/:id" element={<CustomerUpdateView />} />
              <Route path="customers/activities/:id" element={<SettingsView />} />
              <Route path="*" element={<HackViewForDashboardLayout loc="/404" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
