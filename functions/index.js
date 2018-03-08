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


exports.aggregateComments = functions.firestore
    .document('cards/{cardId}/comments/{commentId}')
    .onWrite(event => {

    const commentId = event.params.commentId; 
    const cardId = event.params.cardId;
    
    // ref to the parent document
    const docRef = admin.firestore().collection('cards').doc(cardId)
    
    // get all comments and aggregate
    return docRef.collection('comments').orderBy('createdAt', 'desc')
         .get()
         .then(querySnapshot => {

            // get the total comment count
            const comments = querySnapshot.size

            const recentComments = []

            // add data from the 5 most recent comments to the array
            querySnapshot.forEach(doc => {
                recentComments.push( doc.data() )
            });
            
            // splice 5 lastest comments.
            recentComments.splice(5)


            // data to update on the document
            const data = { comments, recentComments }
            
            // run update
            return docRef.update(data)
         })
         .catch(err => console.log(err) )
});
