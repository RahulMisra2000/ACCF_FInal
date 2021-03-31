// eslint-disable-next-line import/extensions
import firebaseProducts from 'src/config/firebaseConfig';

const { db } = firebaseProducts;

// Returns a promise
// Get a specific record given its id
const get = (collectionName, id) => {
  console.log(`%cREAD Record ${id} in FIRESTORE`, 'background-Color:red; color:white');
  const docRef = db.collection(`/${collectionName}`).doc(id);
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
  console.log('%cCREATE Record in FIRESTORE', 'background-Color:red; color:white');
  data.recStatus = 'Live';
  return db.collection(`/${collectionName}`).add(data);
};

// Returns a promise
const update = (collectionName, id, data) => {  
  console.log(`%cUPDATE Record ${id} in FIRESTORE`, 'background-Color:red; color:white');
  return db.collection(`/${collectionName}`).doc(id).update(data);  
};

// Returns a promise
const remove = (collectionName, id) => {
  console.log(`%cDELETE Record ${id} in FIRESTORE`, 'background-Color:red; color:white');
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
