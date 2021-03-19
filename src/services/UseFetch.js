import { useState, useEffect } from 'react';

// Custom Hook
const useFetch = (url) => {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();

    // setTimeout is ONLY FOR DELAY SIMULATION -- Remove it when GOING LIVE
    setTimeout(() => {
      fetch(url, { signal: abortCont.signal })
        .then((res) => {
          if (!res.ok) { // error coming back from server
            throw Error('could not fetch the data for that resource');
          }
          return res.json();
        })
        .then((d) => {
          setIsPending(false);
          setData(d);
          setError(null);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log('fetch aborted');
          } else {
            // auto catches network / connection error
            setIsPending(false);
            setError(err.message);
          }
        });
    }, 1000);

    // abort the fetch
    return () => abortCont.abort();
  }, [url]);

  return { isPending, data, error };
};

export default useFetch;
