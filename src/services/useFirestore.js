import { useState, useEffect, useContext } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';
import config from 'src/config/myConfig';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
//  It runs only once when the component that uses this hook is mounted
const useFirestore = (collectionName, searchTerm) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  let coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const { isLoggedIn, cArray, populateCustomerArray } = useContext(AppContext);

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
      setIsLoading(true);

      // setTimeout is ONLY FOR DELAY SIMULATION -- Remove it when GOING LIVE
      setTimeout(() => {
        const d = [];

        if (collectionName === 'customers') {
          if (searchTerm) {
            coll = coll.where('name', '==', searchTerm);
          }
        } else {
          //
        }

        // V. IMP -- When querying multiple records (called list in Firestore) you need to make
        // sure that what you specify IN security rule is also specified in the query

        if (config.loggedInUserCanOnlySeeCustomersThatHeCreated) {
          // Security Rule : request.auth.uid == resource.data.uid;
          const whereClauseToMatchSecurityRule = `'uid', '==', '${isLoggedIn.uid}'`;
          console.log(whereClauseToMatchSecurityRule);
          coll = coll.where('uid', '==', isLoggedIn.uid);
        }

        coll.orderBy('createdAt', 'desc')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              d.push({ ...doc.data(), id: doc.id });
            });
            setData(d);
            populateCustomerArray(d);
            setError(null);
          })
          .catch((err) => {
            setError(`Error accessing ${collectionName} from Firestore : ${err.message}`);
          })
          .finally(() => {
            setIsLoading(false);
            console.log('Accessed this data from Firestore');
            console.log(d);
          });
      }, 1500);
    } // else
    return () => {
      console.log('unmounted');
    };
  }, [searchTerm]);

  return { isLoading, data, error };
};

export default useFirestore;
