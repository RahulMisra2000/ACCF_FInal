import { useState, useEffect, useContext } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';
import AppContext from 'src/contexts/appContext';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
//  It runs only once when the component that uses this hook is mounted
const useFirestore = (collectionName, searchTerm) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data
  const { cArray, populateCustomerArray } = useContext(AppContext);

  useEffect(() => {
    // if there is data in the customer's array in the context then we need not go out
    // and get the data from Firestore
    if (collectionName === 'customers' && cArray.length) {
      console.log('%cGetting Data From Cache, not Firestore', 'color:red');
      console.log(cArray);
      setIsLoading(false);
      setData([...cArray]);
      setError(null);
    } else { // Get the data from Firestore
      setIsLoading(true);

      // setTimeout is ONLY FOR DELAY SIMULATION -- Remove it when GOING LIVE
      setTimeout(() => {
        const d = [];

        (collectionName === 'customers' && searchTerm ? coll.where('name', '==', searchTerm) : coll).orderBy('createdAt', 'desc').get()
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
