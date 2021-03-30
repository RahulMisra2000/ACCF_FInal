/* eslint-disable */
import { useState, useEffect, useContext, useRef } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
const useFirestore = ({ collectionName, direction, recordsToReadAtOneTime, page, recordsForThisId }) => {
  let firstRecOnScreenR = useRef(null);
  let lastRecOnScreenR = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  let coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const {
    isLoggedIn,
    claimsInJwt: claims,
  } = useContext(AppContext);

  useEffect(() => {
    const d = [];
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

    // UNIVERSAL WHERE CLAUSE
    if (claims.role !== 'admin') {
      // Security Rule : request.auth.uid == resource.data.uid;
      const whereClauseToMatchSecurityRule = `'uid', '==', '${isLoggedIn.uid}'`;
      coll = coll.where('uid', '==', isLoggedIn.uid);
    }

    // BUILD THE ORDER BY CLAUSE
    coll = coll.orderBy('createdAt', 'desc');

    // RESTRICT NUMBER OF RECORDS READ and STARTING OR ENDING MARKER
    if (direction === 'forward') {        
      if (lastRecOnScreenR?.current) {
        coll = coll.startAfter(lastRecOnScreenR?.current);
      }
      coll = coll.limit(recordsToReadAtOneTime);
    } else if (direction === 'backward') {
      if (firstRecOnScreenR?.current) {
        coll = coll.endBefore(firstRecOnScreenR?.current);
      }
      coll = coll.limitToLast(recordsToReadAtOneTime);
    }

    // NOW GET THE RECORDS
    coll.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          d.push({ ...doc.data(), id: doc.id });
          
          firstRecOnScreenR.current = querySnapshot.docs[0];
          lastRecOnScreenR.current = querySnapshot.docs[querySnapshot.docs.length - 1];
        });
        
        setError(null);
        setData(d);      
      })
      .catch((err) => {
        setError(`Error accessing ${collectionName} from Firestore : ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
      return () => {
        console.log('Component that uses this hook (useFirestore) has just unmounted');
      };
  }, [page]);

  return { isLoading, data, error };
};

export default useFirestore;
