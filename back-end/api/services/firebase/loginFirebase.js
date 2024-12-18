const { auth } = require("./firebase");
const { signInWithEmailAndPassword } = require("firebase/auth");

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error al autenticar usuario:", error.message);
  }
}

module.exports = loginUser;