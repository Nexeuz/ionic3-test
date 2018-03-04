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
