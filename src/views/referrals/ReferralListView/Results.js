import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  Hidden
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, referrals, ...rest }) => {
  const classes = useStyles();

  // STATE
  const [selectedReferralIds, setselectedReferralIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  // HANDLERS
  const handleSelectAll = (event) => {
    let newSelectedReferralIds;

    if (event.target.checked) {
      newSelectedReferralIds = referrals.map((referral) => referral.id);
    } else {
      newSelectedReferralIds = [];
    }

    setselectedReferralIds(newSelectedReferralIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedReferralIds.indexOf(id);
    let newSelectedReferralIds = [];

    if (selectedIndex === -1) {
      newSelectedReferralIds = newSelectedReferralIds.concat(selectedReferralIds, id);
    } else if (selectedIndex === 0) {
      newSelectedReferralIds = newSelectedReferralIds.concat(selectedReferralIds.slice(1));
    } else if (selectedIndex === selectedReferralIds.length - 1) {
      newSelectedReferralIds = newSelectedReferralIds.concat(selectedReferralIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedReferralIds = newSelectedReferralIds.concat(
        selectedReferralIds.slice(0, selectedIndex),
        selectedReferralIds.slice(selectedIndex + 1)
      );
    }

    setselectedReferralIds(newSelectedReferralIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const referralInListClicked = (e, cid) => {
    // Programmatic Navigation
    navigate(`/app/referrals/upd/${cid}`); // TODO
  };

  return (
    <Card
      elevation={5}
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={360}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedReferralIds.length === referrals.length}
                    color="primary"
                    indeterminate={
                      selectedReferralIds.length > 0
                      && selectedReferralIds.length < referrals.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Create Date
                </TableCell>
                <TableCell>
                  By
                </TableCell>
                <TableCell>
                  Reason
                </TableCell>
                <Hidden only={['xs', 'sm']}>
                  <TableCell>
                    Referral Date
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell>
                    Rec Status
                  </TableCell>
                  <TableCell>
                    Part cid
                  </TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {referrals.slice(page * limit, page * limit + limit).map((referral) => (
                <TableRow
                  onClick={(e) => { referralInListClicked(e, referral.id); }}
                  hover
                  key={referral.id}
                  selected={selectedReferralIds.indexOf(referral.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedReferralIds.indexOf(referral.id) !== -1}
                      onChange={(event) => handleSelectOne(event, referral.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      {moment(referral.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                      {/*
                      <Typography
                          color="textPrimary"
                          variant="body1"
                      >
                        {referral.name}
                      </Typography>
                     */}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {referral.uidEmail}
                  </TableCell>
                  <TableCell>
                    {referral.reason}
                  </TableCell>
                  <Hidden only={['xs', 'sm']}>
                    <TableCell>
                      {moment(referral.referredFor).format('MMMM Do YYYY, h:mm:ss a')}
                    </TableCell>
                    <TableCell>
                      {referral.status}
                    </TableCell>
                    <TableCell>
                      {referral.recStatus}
                    </TableCell>
                    <TableCell>
                      {referral.cid.slice(0, 5)}
                    </TableCell>
                  </Hidden>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={referrals.length}
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
  referrals: PropTypes.array.isRequired
};

export default Results;
