/* eslint-disable */
import { useState, useEffect, useContext, useRef } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';

const { db } = firebaseProducts;

const newSearchTermReceived = (lastQ, q) => {
  // Loop thru the 2 objects and make sure that they are identical

  // For now just doing this
  if (lastQ?.current?.name !== q?.name) {
    return true;
  }

  return false;

};

// FOR READING MULTIPLE RECORDS USING PAGINATION
const useFirestore = ({ collectionName, direction, recordsToReadAtOneTime, page, recStatusToFilter, q, recordsForThisId }) => {
  let firstRecOnScreenR = useRef(null);
  let lastRecOnScreenR = useRef(null);
  let d = useRef([]);
  let lastQ = useRef(null);

  if (newSearchTermReceived(lastQ, q)) {
    // Build the where clause

    // Reset Markers
    firstRecOnScreenR.current = null;
    lastRecOnScreenR.current = null;

    // Housekeeping
    lastQ.current = {...q};
  }

  console.log("In useFirestore *****************************************************");


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
    console.log(`%cWill try to access ${collectionName} data from Firestore`, 'background-color:red; color:white');

    setIsLoading(true);

    // UNIVERSAL WHERE CLAUSES
    // 1.
    if (claims.role !== 'admin') {
      // Security Rule : request.auth.uid == resource.data.uid;
      const whereClauseToMatchSecurityRule = `'uid', '==', '${isLoggedIn.uid}'`;
      coll = coll.where('uid', '==', isLoggedIn.uid);
    }
    // 2.
    if (recStatusToFilter) {
      if (recStatusToFilter === 'Archive') {       // only archive
        coll = coll.where('recStatus', '==', 'Archive');
      } else if (recStatusToFilter === 'Live') {  // only live
        coll = coll.where('recStatus', '==', 'Live');
      }
    }

    // 3. 
    // BUILD COLLECTION-SPECIFIC WHERE CLAUSE FOR QUERY
    if (collectionName === 'customers') {
      //
    } else if (collectionName === 'referrals') {
      if (recordsForThisId) {
        coll = coll.where('cid', '==', recordsForThisId);
      }
    }


    // BUILD THE ORDER BY CLAUSE
    coll = coll.orderBy('createdAt', 'desc');

    // RESTRICT NUMBER OF RECORDS READ and STARTING OR ENDING MARKER
    if (direction === 'forward') {        
      if (lastRecOnScreenR?.current) {
        coll = coll.startAt(lastRecOnScreenR?.current);
      }
      coll = coll.limit(recordsToReadAtOneTime);
    } else if (direction === 'backward') {
      if (firstRecOnScreenR?.current) {
        coll = coll.endAt(firstRecOnScreenR?.current);
      }
      coll = coll.limitToLast(recordsToReadAtOneTime);
    }

    // NOW GET THE RECORDS
    coll.get()
      .then((querySnapshot) => {
        let noRecsFound = true;
        let ftime = true;
        querySnapshot.forEach((doc) => {
          if (ftime) {
            d.current = [];
          }
          d.current.push({ ...doc.data(), id: doc.id });
          noRecsFound = false;          
          firstRecOnScreenR.current = querySnapshot.docs[0];
          lastRecOnScreenR.current = querySnapshot.docs[querySnapshot.docs.length - 1];
          ftime = false;
        });
        
        if (noRecsFound) {
          if (page == 1) {
            setError('999');  // No records at all
          } else {
            setError('1');    // No more records
          }
        } else {
          setError(null);
        } 
        setData([...d.current]);              
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
