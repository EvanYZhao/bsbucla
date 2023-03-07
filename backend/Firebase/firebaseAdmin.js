const admin = require("firebase-admin");

const serviceAccount = require("./cs35l-studyspaces-firebase-adminsdk-j8tnb-73f5ebdf00.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function verifyToken(token) {
  const user = await admin
    .auth()
    .verifyIdToken(token)
    .then(decoded => decoded)
    .catch(() => {
      return null;
    });
  
  return user;
}

module.exports = verifyToken;