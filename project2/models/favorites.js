//this file is derived from the user-auth exercise provided by Rafa Pacas (@rapala61) and Bobby King (@gittheking) at General Assembly.

//getFavorites, deleteFavorites and saveFavorites functions are derived from the user-auth exercise provided by Rafa Pacas (@rapala61) and Bobby King (@gittheking) at General Assembly.


const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect.js');

const dbConnection = 'mongodb://localhost:27017/surroundSound';

//access saved songs from this specific user (with userId)
function getFavorites(req, res, next) {
  getDB().then((db) => {
    db.collection('favorites')
      .find({ userId: { $eq: req.session.userId } })
      .toArray((toArrErr, data) => {
        if (toArrErr) return next(toArrErr);
        res.favorites = data;
        db.close();
        next();
      });
      return false;
  });
  return false;
}

//to save new songs to user's collection
function saveFavorites(req, res, next) {
  // creating an empty object for the insertObj
  const insertObj = {};

  //req.body used for post
  // copying all of req.body into insertObj
  for(key in req.body) {
    insertObj[key] = req.body[key];
  }

  // adding userId to insertObj
  insertObj.userId = req.session.userId;

  getDB().then((db) => {
    db.collection('favorites')
      .insert(insertObj, (insertErr, result) => {
        if (insertErr) return next(insertErr);
        res.saved = result;
        db.close();
        next();
      });
      return false;
  });
  return false;
}

// Delete method doesn't change because we are deleting objects from the database
// based on that object's unique _id - you do not need to specify which user as
// the _id is sufficient enough
function deleteFavorites(req, res, next) {
  getDB().then((db) => {
    db.collection('favorites')
      .findAndRemove({ _id: ObjectID(req.params.id) }, (removeErr, result) => {
        if (removeErr) return next(removeErr);
        res.removed = result;
        db.close();
        next();
      });
      return false;
  });
  return false;
}

function obtainFavorites(req, res, next){
  getDB().then((db) => {
  db.collection('favorites')
  .findOne({_id: ObjectID(req.params.id) }, (findErr, result) => {
    if (findErr) return next(findErr);

    res.obtained = result;
    db.close();
    return next();
  });
  return false;
});
  return false;
}

function changeFavorites(req, res, next){
  getDB().then((db) => {
  db.collection('favorites')
  .findAndModify({_id: ObjectID(req.params.id) }, [],
  { $set: {name:req.body.editObj }}, { new: true }, (updateErr, result) => {
    if (updateErr) return next(updateErr);

    res.changed = result;
    db.close();
    return next();
  });
  return false;
});
return false;
}

module.exports = { getFavorites, saveFavorites, deleteFavorites, obtainFavorites, changeFavorites };
