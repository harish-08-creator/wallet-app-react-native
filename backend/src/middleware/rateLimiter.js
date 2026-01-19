import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //the argument string passed is an user identifier which can be user_id,IP address in prod grade apps
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success)
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });

    next();
  } catch (error) {
    console.log("rate limit error: ", error);
    next(error);
  }
};

export default rateLimiter;
