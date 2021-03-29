import { useState, useEffect, useContext } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';
import config from 'src/config/myConfig';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
//  It runs only once when the component that uses this hook is mounted
const useFirestore = ({ collectionName, recordsForThisId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  let coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const {
    isLoggedIn,
    claimsInJwt: claims,
    cArray,
    populateCustomerArrayToCache,
    rArray,
    populateReferralArrayToCache,
  } = useContext(AppContext);

  useEffect(() => {
    const d = [];
    // TRY TO GET DATA FROM CACHE
    if (collectionName === 'customers' && cArray.length) {
      console.log(`%cGetting ${collectionName} data From Cache, not Firestore`, 'background-color:green; color:white');
      setIsLoading(false);
      setData([...cArray]);
      setError(null);
    } else if (collectionName === 'referrals' && rArray.length) {
      console.log(`%cGetting ${collectionName} data From Cache, not Firestore`, 'background-color:green; color:white');
      setIsLoading(false);
      // If there is a filter (recordsForThisId) then only return records for recordsForThisId
      // ie Return only those referral records whose cid is the same as recordsForThisId
      setData(recordsForThisId
        ? [...rArray.filter((v) => { return v.cid === recordsForThisId; })]
        : [...rArray]);
      setError(null);
    } else {
    // CACHE DOES NOT HAVE IT SO, GET FROM FIRESTORE
      console.log(`%cWill try to access ${collectionName} data from Firestore`, 'background-color:red; color:white');
      setIsLoading(true);

      // BUILD COLLECTION-SPECIFIC WHERE CLAUSE FOR QUERY
      if (collectionName === 'customers') {
        //
      } else if (collectionName === 'referrals') {
        if (recordsForThisId) {
          coll = coll.where('cid', '==', recordsForThisId);
        }
      }

      // V. IMP -- When querying multiple records (called list in Firestore) you need to make
      // sure that what you specify IN security rule is also specified in the query

      // Regular Users can only see their records
      // UNIVERSAL WHERE CLAUSE (for all collections)
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
          if (collectionName === 'customers') {
            populateCustomerArrayToCache(d);
          } else if (collectionName === 'referrals') {
            populateReferralArrayToCache(d);
          }
          // Because setting state is async, try doing all the work before setting it
          setError(null);
          setData(d);      
        })
        .catch((err) => {
          setError(`Error accessing ${collectionName} from Firestore : ${err.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    // }, 1500);
    } // else
    return () => {
      console.log('Component that uses this hook (useFirestore) has just unmounted');
    };
  }, []);

  return { isLoading, data, error };
};

export default useFirestore;
