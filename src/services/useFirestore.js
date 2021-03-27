import { useState, useEffect, useContext } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';
import config from 'src/config/myConfig';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
//  It runs only once when the component that uses this hook is mounted
const useFirestore = (collectionName) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  let coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const {
    isLoggedIn,
    claimsInJwt: claims,
    cArray,
    populateCustomerArray
  } = useContext(AppContext);

  useEffect(() => {
    // Get data from CACHE
    if (collectionName === 'customers' && cArray.length) {
      console.log('%cGetting Data From Cache, not Firestore', 'color:red');
      console.log(cArray);
      setIsLoading(false);
      setData([...cArray]);
      setError(null);
    } else {
    // Get the data from FIRESTORE
      console.log('%cWill try to access data from Firestore', 'background-color:red; color:white');
      setIsLoading(true);

      // setTimeout is ONLY FOR DELAY SIMULATION -- Remove it when GOING LIVE
      setTimeout(() => {
        const d = [];

        // BUILD WHERE CLAUSE FOR QUERY
        if (collectionName === 'customers') {
          //
        } else {
          //
        }

        // V. IMP -- When querying multiple records (called list in Firestore) you need to make
        // sure that what you specify IN security rule is also specified in the query

        // Regular Users can only see their records
        if (claims.role !== 'admin') {
          if (config.loggedInUserCanOnlySeeCustomersThatHeCreated) {
            // Security Rule : request.auth.uid == resource.data.uid;
            const whereClauseToMatchSecurityRule = `'uid', '==', '${isLoggedIn.uid}'`;
            console.log(whereClauseToMatchSecurityRule);
            coll = coll.where('uid', '==', isLoggedIn.uid);
          }
        }

        // BUILD THE ORDER BY CLAUSE
        coll = coll.orderBy('createdAt', 'desc');

        // NOW GET THE RECORDS
        coll.get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              d.push({ ...doc.data(), id: doc.id });
            });
            console.log(d);
            setData(d);
            populateCustomerArray(d);
            setError(null);
          })
          .catch((err) => {
            setError(`Error accessing ${collectionName} from Firestore : ${err.message}`);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 1500);
    } // else
    return () => {
      console.log('unmounted');
    };
  }, []);

  return { isLoading, data, error };
};

export default useFirestore;
