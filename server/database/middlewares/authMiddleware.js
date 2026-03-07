import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized.Login Again" });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    if (decodeToken.id) {
      req.body = req.body || {};
      req.body.userId = decodeToken.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized",
      });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authMiddleware;
