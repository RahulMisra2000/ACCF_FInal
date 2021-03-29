import React, { useContext } from 'react';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import firebaseProducts from 'src/config/firebaseConfig';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles
} from '@material-ui/core';
import AppContext from 'src/contexts/appContext';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    color: theme.palette.primary.main,    
    '& $title': {
      fontWeight: theme.typography.fontWeightBold
    },
    '& $icon': {
      color: theme.palette.primary.main
    },
    border: '1px solid'
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const { invalidateCache } = useContext(AppContext);
  const navigate = useNavigate();

  // logout the user
  const logOutTheUser = () => {
    const { auth } = firebaseProducts;
    invalidateCache();
    auth.signOut();
    navigate('/app/dashboard', { replace: true });
  };

  // console.log(location.pathname);
  // console.log(href);

  // Special processing
  if (rest?.type === 1) {    
    return (
      <ListItem        
        className={clsx(classes.item, className)}
        disableGutters
      >
        <Button
          activeClassName={classes.active}
          className={classes.button}
          onClick={logOutTheUser}
        >
          {Icon && (
            <Icon
              className={classes.icon}
              size="20"
            />
          )}
          <span className={classes.title}>
            {title}
          </span>
        </Button>
      </ListItem>
    );
  }

  return (
    <ListItem      
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button        
        activeClassName={classes.active}
        className={classes.button}
        component={RouterLink}
        to={href}
      >
        {Icon && (
          <Icon
            className={classes.icon}
            size="20"
          />
        )}
        <span className={classes.title}>
          {title}
        </span>
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;
