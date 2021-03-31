/* eslint-disable */
import { useState, useEffect, useContext, useRef } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';

const { db } = firebaseProducts;

const haveSameData = (obj1, obj2) => {
  if (!obj1 && obj2 || !obj2 && obj1) {
    return false
  }

  if (!obj1 && !obj2) {
    return true;
  }

  const obj1Length = Object.keys(obj1).length;
  const obj2Length = Object.keys(obj2).length;

  if (obj1Length === obj2Length) {
      return Object.keys(obj1).every(
          key => obj2.hasOwnProperty(key)
              && obj2[key] === obj1[key]);
  }
  return false;
}

// FOR READING MULTIPLE RECORDS USING PAGINATION
const useFirestore = ({ collectionName, direction, recordsToReadAtOneTime, page, recStatusToFilter, q, recordsForThisId }) => {
  let firstRecOnScreenR = useRef(null);
  let lastRecOnScreenR = useRef(null);
  let dR = useRef([]);
  let lastQR = useRef(null); // will contain previous search term

  if (!haveSameData(lastQR.current, q)) {

    // Reset Markers
    firstRecOnScreenR.current = null;
    lastRecOnScreenR.current = null;

    // Housekeeping
    lastQR.current = {...q};
  }

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
    // 2. Default if this is not provided, will return all records regardless of recStatus
    if (recStatusToFilter) {
      if (recStatusToFilter === 'Archive') {       // only archive
        coll = coll.where('recStatus', '==', 'Archive');
      } else if (recStatusToFilter === 'Live') {  // only live
        coll = coll.where('recStatus', '==', 'Live');
      }
    }

    // 3. 
    // BUILD COLLECTION-SPECIFIC WHERE & ORDERBY CLAUSE FOR QUERY
    if (collectionName === 'customers') {
      if (q) {
        console.log('******************************** BUILD WHERE CLAUSE FOR SEARCH TERM');
        console.log(q);

        // HAVE to use if - else if because Firestore supports logical AND and does not support OR
        // so only one search criteria can be used
        if (q.name) {
          coll = coll.where('name', '>=', q.name);          
          coll = coll.orderBy('name');                  // BUILD THE ORDER BY CLAUSE
        } else if (q.phone) {
          coll = coll.where('phone', '>=', q.phone);
          coll = coll.orderBy('phone');                  // BUILD THE ORDER BY CLAUSE
        } else if (q.fDate && q.tDate){
          coll = coll.where('createdAt', '>=', new Date(q.fDate).getTime());
          coll = coll.where('createdAt', '<=', new Date(q.tDate).getTime());
        } else if (q.fDate){
          coll = coll.where('createdAt', '>=', new Date(q.fDate).getTime());
        } else if (q.tDate) {
          coll = coll.where('createdAt', '<=', new Date(q.tDate).getTime());
        }
      }
    }
    
    if (collectionName === 'referrals') {
      if (recordsForThisId) {
        coll = coll.where('cid', '==', recordsForThisId);
      }
    } 
    
    coll = coll.orderBy('createdAt', 'desc');         // BUILD THE ORDER BY CLAUSE which is common to all
    

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
            dR.current = [];
          }
          dR.current.push({ ...doc.data(), id: doc.id });
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
        setData([...dR.current]);              
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
  }, [page, q]);

  return { isLoading, data, error };
};

export default useFirestore;
