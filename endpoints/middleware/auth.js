const jwt = require("jsonwebtoken");

const auth = (request, response, next) => {
  const authorization = request.get("Authorization");
  let decodedData;
  try {
    if (
      authorization &&
      authorization.toLocaleLowerCase().startsWith("bearer")
    ) {
      const token = authorization.substring(7);
      decodedData = jwt.verify(token, process.env.SECRET);
      console.log({ decodedData });
    }
    if (!decodedData || !decodedData.id) {
      response.status(403).send("Token missing or invalid");
    }
  } catch (error) {
    response.status(403).send("Token missing or invalid");
  }
  next();
};

module.exports = auth;
