// eslint-disable-next-line import/extensions
import firebaseProducts from 'src/config/firebaseConfig';

const { db } = firebaseProducts;

// Returns a promise
// Get a specific record given its id
const get = (collectionName, cid) => {
  const docRef = db.collection(`/${collectionName}`).doc(cid);
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
const create = (collectionName, data) => {
  data.recStatus = 'Live';
  return db.collection(`/${collectionName}`).add(data);
};

// Returns a promise
const update = (collectionName, id, data) => {  
  return db.collection(`/${collectionName}`).doc(id).update(data);  
};

// Returns a promise
const remove = (collectionName, id) => {
  return db.collection(`/${collectionName}`).doc(id).delete();
};

const CRUDService = {
  get,
  // getAll --- use useFirestore variants for reading multiple records
  create,
  update,
  remove
};

export default CRUDService;
