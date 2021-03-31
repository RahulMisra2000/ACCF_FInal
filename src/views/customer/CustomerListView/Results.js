/* eslint-disable */
import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
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

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2),
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.primary.light
  },
  headerLabels: {
    color: theme.palette.info.dark,
    fontWeight: theme.typography.fontWeightLight
  }
}));

const Results = ({ className, customers, prevClicked, nextClicked, enablePrev, enableNext, ...rest }) => {
  const classes = useStyles();

  // STATE
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  // const [limit, setLimit] = useState(5);
  // const [page, setPage] = useState(0);
  const navigate = useNavigate();

  // HANDLERS
  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  /*
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    // page : page number before the next/prev arrow is clicked
    // newPage : page number after the next prev arrow is clicked
    console.log(page);
    console.log(newPage);
    setPage(newPage);
  };
  */

  const customerInListClicked = (e, cid) => {
    // Programmatic Navigation
    navigate(`/app/customers/upd/${cid}`);
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.length === customers.length}
                      color="primary"
                      indeterminate={
                        selectedCustomerIds.length > 0
                        && selectedCustomerIds.length < customers.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
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
                  <TableRow
                    onClick={(e) => { customerInListClicked(e, customer.id); }}
                    hover
                    key={customer.id}
                    selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                        onChange={(event) => handleSelectOne(event, customer.id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        alignItems="center"
                        display="flex"
                      >
                        <Avatar                          
                          className={classes.avatar}
                          src={customer.avatarUrl}
                        >
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography
                          color={customer.status === 'Open' ? "textPrimary" : "textSecondary"}
                          variant="body1"
                        >
                          {customer.name.slice(0,15)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {customer.phone}
                    </TableCell>
                    <Hidden only={['xs', 'sm']}>
                      <TableCell>
                        {customer.uidEmail.slice(0,15)}
                      </TableCell>
                      <TableCell>
                        {customer.email.slice(0,15)}
                      </TableCell>
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                      <TableCell>
                        {moment(customer.createdAt).format('MMMM Do YYYY, h:mm a')}
                      </TableCell>
                      <TableCell>
                        {customer.id}
                      </TableCell>
                      <TableCell>
                        {customer.status}
                      </TableCell>
                      <TableCell>
                        {customer.recStatus}
                      </TableCell>
                    </Hidden>
                  </TableRow>
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
