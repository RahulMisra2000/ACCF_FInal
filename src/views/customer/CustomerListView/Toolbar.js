/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {},
  TextField: {
    marginLeft: theme.spacing(1),
    maxWidth: "35%",
    marginTop: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  title: {
    color: theme.palette.info.dark,
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const Toolbar = ({ className, searchFn, ...rest }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fDate, setFDate] = useState('');
  const [tDate, setTDate] = useState('');


  const constructSearchObjectAndCallParentComponent = (e) => {
    
    // Build the search object to be sent to the parent's function
    const n = name;
    const p = phone;
    const f = fDate;
    const t = tDate;

    // Call function in parent
    searchFn({name: n, phone: p, fDate: f, tDate: t});

    // Re-initialize so that the search button gets disabled
    setName('');
    setPhone('');
    setFDate('');
    setTDate('');
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
        <Typography variant="h3" component="h3" className={classes.title}>
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
      <Box mt={3}>
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
                className={classes.TextField}                
              />
              <TextField
                fullWidth
                size="small"                
                placeholder="<Phone>"
                variant="outlined"
                value={phone}
                onChange={(e) => {                  
                  setPhone(e.target.value);
                }}
                className={classes.TextField}
              />
              <Button              
                fullwidth
                variant="contained"
                size="small"
                color="secondary"
                className={classes.button}
                disabled={!name && !phone && !fDate && !tDate}
                onClick={(e) => {
                  constructSearchObjectAndCallParentComponent(e);
                }}
              >
                Search
              </Button>
              {/* This shows a button if there is something in the search field
              { q ? (
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          searchFn(q);
                        }}
                      >
                        Search
                      </Button>
                    ) 
                  : null
              }
            */}
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
                className={classes.TextField}                
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
                className={classes.TextField}
              />
            </Box>
            
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
