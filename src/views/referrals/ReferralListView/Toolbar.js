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
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, searchFn, ...rest }) => {
  const classes = useStyles();
  const [q, setQ] = useState('');

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
          REFERRAL RECORDS
        </Typography>
        {/*
        <Button className={classes.exportButton}>
          Export
        </Button>
        */}
        <Link to="/app/referrals/add">
          <Button
            color="primary"
            variant="contained"
          >
            Add New Referral
          </Button>
        </Link>
      </Box>
      <Box mt={3}>
        <Card
        elevation={5}>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Type name and press <Enter>"
                variant="outlined"
                value={q}
                onChange={(e) => {
                  console.log(e.target.value);
                  setQ(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    console.log('enter key pressed', q);
                    searchFn(q);
                  }
                }}
              />
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
        <Card
        elevation={5}>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Type name and press <Enter>"
                variant="outlined"
                value={q}
                onChange={(e) => {
                  console.log(e.target.value);
                  setQ(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    console.log('enter key pressed', q);
                    searchFn(q);
                  }
                }}
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
