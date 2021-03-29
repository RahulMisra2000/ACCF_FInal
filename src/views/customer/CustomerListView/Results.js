import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
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
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, customers, ...rest }) => {
  const classes = useStyles();

  // STATE
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
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

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

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
      <PerfectScrollbar>
        <Box minWidth={360}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
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
                    Name
                  </TableCell>
                  <TableCell>
                    Phone
                  </TableCell>
                  <Hidden only={['xs', 'sm']}>
                    <TableCell>
                      Navigator
                    </TableCell>
                    <TableCell>
                      Case
                    </TableCell>
                    <TableCell>
                      Created At
                    </TableCell>
                  </Hidden>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.slice(page * limit, page * limit + limit).map((customer) => (
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
                          color="textPrimary"
                          variant="body1"
                        >
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {customer.phone}
                    </TableCell>
                    <Hidden only={['xs', 'sm']}>
                      <TableCell>
                        {customer.uidEmail}
                      </TableCell>
                      <TableCell>
                        {customer.email}
                      </TableCell>
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                      <TableCell>
                        {moment(customer.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                      </TableCell>
                    </Hidden>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>      
      <TablePagination
        component="div"
        count={customers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
