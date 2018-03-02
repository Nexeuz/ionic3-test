const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


exports.aggregateLikes = functions.firestore.document('cards/{cardId}/likes/{likeId}').onWrite(event => {

    const cardId = event.params.cardId;

    const cardRef = admin.firestore().collection('cards').doc(cardId);


     cardRef.collection('likes').where('like', '==', true)
        .get()
        .then(querySnapshot => {

            const contLikes = querySnapshot.size;

            return cardRef.update({ likes: contLikes });

        }).catch(err => console.log(err))






}); // funtions


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });



// .get()
//         .then(querySnapshot => {

//             const collectionArray = [];

//             querySnapshot.forEach(doc => {

//                 collectionArray.push(doc.data());

//                 const cardId = admin.firestore().collection('cards');

//                  cardId.doc()
//                 .get()
//                 .then(data => {

//                     const infoLike = data();
//                     if (infoLike.likes) {
//                         const likesi = {
//                             likes: infoLike.likes + 1
//                         }
//                         cardId.update(likesi);
//                     } else {
//                         const likesi = {
//                             likes: 1
//                         }
//                         cardId.update(likesi);
//                     }

//                     return null;
//                 }).catch(err => console.log(err));
//             });
//             return null;
//         }).catch(error => console.log(error));


