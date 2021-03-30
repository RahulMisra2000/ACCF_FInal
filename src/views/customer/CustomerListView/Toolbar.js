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
  button: {
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, searchFn, ...rest }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');


  const constructSearchObjectAndCallParentComponent = (e) => {
    searchFn({name, city});
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
        <Typography variant="h3" component="h3">
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
                  console.log(e.target.value);
                  setName(e.target.value);
                }}                
              />
              <TextField
                fullWidth
                size="small"                
                placeholder="<City>"
                variant="outlined"
                value={city}
                onChange={(e) => {
                  console.log(e.target.value);
                  setCity(e.target.value);
                }}
              />
              <Button              
                fullwidth
                variant="contained"
                size="small"
                color="secondary"
                className={classes.button}
                startIcon={<SearchIcon />}
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
