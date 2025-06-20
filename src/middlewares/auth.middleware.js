import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .json({ errors: ["Authorization failed: No token provided."] });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ errors: ["Authorization failed: Invalid token provided."] });
    req.user = user;
    next();
  });
};
