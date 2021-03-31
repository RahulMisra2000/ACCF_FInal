/* eslint-disable */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Checkbox,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Divider
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {},
  TextField: {
    maxWidth: "30%"    
  },
  CheckBox: {
    width: "30%"    
  },
  button: {
    paddingLeft: theme.spacing(1),
  },
  title: {
    color: theme.palette.info.dark,
    fontWeight: theme.typography.fontWeightLight
  },
  margin: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1)
  }
}));

const Toolbar = ({ className, searchFn, ...rest }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fDate, setFDate] = useState('');
  const [tDate, setTDate] = useState('');
  const [status, setStatus] = useState(false);
  const [recStatus, setRecStatus] = useState(false);

  let selectedContentR = useRef('');

  const constructSearchObjectAndCallParentComponent = (e) => {
    
    // Build the search object to be sent to the parent's function
    const n = name;
    const p = phone;
    const f = fDate;
    const t = tDate;
    const s = status;
    const r = recStatus;

    // Call function in parent
    searchFn({name: n, phone: p, fDate: f, tDate: t, excludeClosedOnes: s, excludeArchivedOnes: r});

    // Compose Selected Area    
    
    // Only one of these will go into effect
    if (name) {
      selectedContentR.current = `Name: ${name}`;
    } else if (phone) {
      selectedContentR.current = `Phone: ${phone}`;
    } else if (fDate || tDate) {
      if (fDate) {
        selectedContentR.current = `From Date: ${new Date(fDate).toLocaleDateString() + ' ' + new Date(fDate).toLocaleTimeString()}`;
      }
      if (tDate) {
        selectedContentR.current += `    To Date: ${new Date(tDate).toLocaleDateString() + ' ' + new Date(tDate).toLocaleTimeString()}`;
      }
    } 
    
    // These if selected will always go into effect
    if (status) { // exclude records where status == 'Close'
      selectedContentR.current += ` (Excluding closed records) `;
    }
    if (recStatus) { // exclude archived records
      selectedContentR.current += ` (Excluding archived records) `;
    }

    // Re-initialize so that the search button gets disabled until something is typed
    setName('');
    setPhone('');
    setFDate('');
    setTDate('');
    setStatus(false);
    setRecStatus(false);
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Typography variant="h3" component="h3" className={clsx(classes.title, classes.margin, className)}>
          CASE MANAGEMENT RECORDS
        </Typography>
        {/*
        <Button className={classes.exportButton}>
          Export
        </Button>
        */}
        <Link to="/app/customers/add">
          <Button
            color="primary"
            variant="contained"
          >
            Add New Case
          </Button>
        </Link>
      </Box>
      <Box mt={1}>
        <Card
        elevation={5}>
          <CardContent>
            <Box maxWidth={600} display='flex'>
              <TextField
                fullWidth
                size="small"                
                placeholder="<Name>"
                variant="outlined"
                value={name}
                onChange={(e) => {                  
                  setName(e.target.value);
                }}
                className={clsx(classes.TextField, classes.margin, className)}                
              />
              <TextField
                fullWidth
                size="small"                
                placeholder="<Phone>"
                variant="outlined"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); }}
                className={clsx(classes.TextField, classes.margin, className)}                
              />
              <Checkbox
                checked={status}
                onChange={(e) => { setStatus((prevState) => {
                  return !prevState;
                }); }}
              />
              <Typography color="textSecondary" className={clsx(classes.CheckBox, classes.margin, className)}>Exclude Closed</Typography>

              <Checkbox
                checked={recStatus}
                onChange={(e) => { setRecStatus((prevState) => {
                  return !prevState;
                }); }}
              />
              <Typography color="textSecondary" className={clsx(classes.CheckBox, classes.margin, className)}>Exclude Archived</Typography>
            </Box>
          
            <Box maxWidth={600} display='flex'>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"                
                placeholder="<From Date>"
                variant="outlined"
                value={fDate}
                onChange={(e) => {                  
                  setFDate(e.target.value);
                }}
                className={clsx(classes.TextField, classes.margin, className)}                                
              />
              <TextField
                 type="datetime-local"
                fullWidth
                size="small"                
                placeholder="<To Date>"
                variant="outlined"
                value={tDate}
                onChange={(e) => {                  
                  setTDate(e.target.value);
                }}
                className={clsx(classes.TextField, classes.margin, className)}                
              />
                            <Button              
                fullwidth
                variant="contained"
                size="small"
                color="secondary"
                className={clsx(classes.button, classes.margin, className)}    
                disabled={!name && !phone && !fDate && !tDate && !status && !recStatus}
                onClick={(e) => {
                  constructSearchObjectAndCallParentComponent(e);
                }}
              >
                Search
              </Button>
            </Box>            
            {/* SELECTION */}
            {selectedContentR.current ? 
              (
                <>
                  <Divider className={clsx(classes.margin, className)}/>
                  <Box maxWidth={600} display='flex'>
                    <Typography variant="h6" component="h6" className={clsx(classes.title, classes.margin, className)}>
                      YOUR SELECTION: {selectedContentR.current} 
                    </Typography>
                  </Box>
                </>
              ) : null}            
          </CardContent>
        </Card>        
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  searchFn: PropTypes.func
};

export default Toolbar;
