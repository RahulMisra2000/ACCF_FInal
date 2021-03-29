// eslint-disable-next-line import/extensions
import firebaseProducts from 'src/config/firebaseConfig';

const { db } = firebaseProducts;

const col = db.collection('/referrals');

// Returns a promise
// Get a specific record given its id
const get = (id) => {
  const docRef = col.doc(id);
  /*
  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  */

  return docRef.get();
};

// use useFirestore.js to get a list of customers from Firestore.
// Not this
/*
const getAll = () => {
  return col;
};
*/

// Returns a promise
const create = (data) => {
  return col.add(data);
};

// Returns a promise
const update = (id, value) => {
  return col.doc(id).update(value);
};

// Returns a promise
const remove = (id) => {
  return col.doc(id).delete();
};

const ReferralService = {
  get,
  // getAll,
  create,
  update,
  remove
};

export default ReferralService;
