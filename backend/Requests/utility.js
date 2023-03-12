const verifyToken = require('../Firebase/firebaseAdmin');
const { UserModel } = require('../Models');

/**
 * Verifies an Express request.
 * 1. Authenticates Google user with JWT Authorization String and Firebase Admin
 * 2. Verifies request body
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {mongoose.Model} Model Mongoose Model Schema
 * @param {Array} nonRepeatedFields Array of field names not to be repeated
 * @returns An `Array` of `[ user, doc ]`
 */
async function verifyRequest (req, res) {
  // Verify user token with Firebase Admin
  let token = req.headers.authorization;
  if (!token) {
    res.status(401);
    res.send('Unauthorized: no token');
    return false;
  }
  if (token.length < 3) {
    res.status(401);
    res.send('Unauthorized: invalid token');
    return false;
  }
  token = token.split(' ')[1]
  const user = await verifyToken(token);
  if (!user) {
    res.status(401);
    res.send('Unauthorized: invalid user');
    return false;
  }

  // Create a new user if does not exist
  let existingUser = await UserModel.findOne({ firebaseId: user.uid });
  if (!existingUser) {
    const newUser = new UserModel({
      firebaseId: user.uid,
      name: user.name,
      email: user.email,
      picture: user.picture
    });

    existingUser = await newUser.save();
  }

  return existingUser;
}

/**
 * Verifies an Express request with query checking.
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {Array<string>} queries Array of query keys to match for
 * @returns 
 */
async function verifyRequestQuery(req, res, queries) {
  const user = await verifyRequest(req, res);
  if (!user)
    return false;

  if (!req.query) {
    res.status(400);
    res.send('Bad Request: missing/invalid queries');
    return false;
  }

  const allQueriesMatched = queries.every((query) => req.query.hasOwnProperty(query));

  if (!allQueriesMatched) {
    res.status(400);
    res.send('Bad Request: missing/invalid queries');
    return false;
  }

  return user;
}

/**
 * Verifies an Express request with body field checking and Model Schema validation.
 * `nonRepeatedFields` can be used to block requests if a document containing any of the fields already exists.
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {mongoose.Model} Model Mongoose Schema Object
 * @param {Array<string>} nonRepeatedFields Array of fields used to match against any existing documents
 * @returns 
 */
async function verifyRequestBody(req, res, Model, nonRepeatedFields=[]) {
  const user = await verifyRequest(req, res);
  if (!user)
    return false;

  // Verify correct document fields
  const docObject = req.body;
  if (!docObject) {
    res.status(400);
    res.send('Bad Request: invalid body');
    return false;
  }

  // Verify Model Schema
  const doc = new Model(docObject);
  if (!!doc.validateSync()) {
    res.status(400);
    res.send('Bad Request: missing/invalid document fields');
    return false;
  }

  // Verify no repeated fields
  for (const field of nonRepeatedFields) {
    const existingDoc = await Model.findOne({ [field]: docObject[field]})
      .then((docObject) => {
        return !!docObject;
      })
    if (existingDoc) {
      res.status(400);
      res.send(`Bad Request: document with field "${field}" already exists`);
      return false;
    }
  }

  return [user, doc];
}

module.exports = { verifyRequest, verifyRequestQuery, verifyRequestBody };