import { useState, useEffect } from 'react';
import firebaseProducts from 'src/config/firebaseConfig';

const { db } = firebaseProducts;

// This custom hook is for reading multiple records from a collection
//  It runs only once when the component that uses this hook is mounted
const useFirestore = (collectionName) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const coll = db.collection(collectionName);
  // https://firebase.google.com/docs/firestore/query-data/get-data

  useEffect(() => {
    // setTimeout is ONLY FOR DELAY SIMULATION -- Remove it when GOING LIVE
    setTimeout(() => {
      const d = [];
      coll.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            d.push({ ...doc.data(), id: doc.id });
          });
          setIsLoading(false);
          setData(d);
          setError(null);
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err.message);
        })
        .finally(() => {
          console.log(d);
        });
    }, 1500);

    return () => {
      console.log('unmounted');
    };
  }, []);

  return { isLoading, data, error };
};

export default useFirestore;
