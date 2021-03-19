import { useState, useEffect } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
//  It runs only once when the component that uses this hook is mounted
const useFirestore = (collectionName, searchTerm) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data

  useEffect(() => {
    // setTimeout is ONLY FOR DELAY SIMULATION -- Remove it when GOING LIVE
    setTimeout(() => {
      const d = [];
      setIsLoading(true);

      (collectionName === 'customers' && searchTerm ? coll.where('name', '==', searchTerm) : coll).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            d.push({ ...doc.data(), id: doc.id });
          });
          setData(d);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
          console.log('Accessed this data from Firestore');
          console.log(d);
        });
    }, 1500);

    return () => {
      console.log('unmounted');
    };
  }, [searchTerm]);

  return { isLoading, data, error };
};

export default useFirestore;
