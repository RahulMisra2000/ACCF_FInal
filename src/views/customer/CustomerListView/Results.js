/* eslint-disable */
import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Hidden,
  Paper
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import { useNavigate } from 'react-router-dom';
import Result from './Result';

const useStyles = makeStyles((theme) => ({
  root: {},
  headerLabels: {
    color: theme.palette.info.dark,
    fontWeight: theme.typography.fontWeightLight
  }
}));

const Results = ({ className, customers, prevClicked, nextClicked, enablePrev, enableNext, ...rest }) => {
  const classes = useStyles();

  // STATE
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const navigate = useNavigate();

  // HANDLERS
  const customerInListClicked = (e, id) => {
    // Programmatic Navigation
    navigate(`/app/customers/upd/${id}`);
  };

  return (
    <Card
      elevation={5}
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <PerfectScrollbar>
        <Box minWidth={360}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead >
                <TableRow >
                  <TableCell>
                    <Typography className={classes.headerLabels} variant="h5">NAME</Typography>                    
                  </TableCell>
                  <TableCell>
                  <Typography className={classes.headerLabels} variant="h5">PHONE</Typography>                    
                  </TableCell>
                  <Hidden only={['xs', 'sm']}>
                    <TableCell>
                      <Typography className={classes.headerLabels} variant="h5">NAVIGATOR</Typography>                    
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerLabels} variant="h5">EMAIL</Typography>                    
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerLabels} variant="h5">REGISTERED</Typography>                    
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerLabels} variant="h5">ID</Typography>                    
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerLabels} variant="h5">STATUS</Typography>                    
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerLabels} variant="h5">ARC/LIVE</Typography>                    
                    </TableCell>
                  </Hidden>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                   <Result customer={customer} customerInListClicked={customerInListClicked}/>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>      
      </CardContent>
      <CardActions>
      <Button disabled={!enablePrev} size="small" variant="outlined" color="primary" onClick={prevClicked}>PREV</Button>
      <Button disabled={!enableNext} size="small" variant="outlined" color="primary" onClick={nextClicked}>NEXT</Button>
      </CardActions>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired,
  prevClicked: PropTypes.func,
  nextClicked: PropTypes.func
};

export default Results;
