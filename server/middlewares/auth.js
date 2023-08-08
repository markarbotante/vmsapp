"use strict";

const rekuire = require("rekuire");
const Errors = rekuire("Errors");

const Auth = {
  validateApp: (req, res, next) => {
    /* Env Values */
    let _clientid = process.env.APP_CLIENT_ID;
    let _clientSecret = process.env.APP_CLIENT_SECRET;

    /* User Values */
    let clientid = req.headers["x-client-id"] || "";
    let clientsecret = req.headers["x-client-secret"] || "";

    console.log(_clientid);

    try {
      if (!clientid) {
        throw new Error("Client Id is missing.");
      }
      if (!clientsecret) {
        throw new Error("Client Secret is missing");
      }
      if (_clientid !== clientid) {
        throw new Error("Invalid Client Id.");
      }
      if (_clientSecret !== clientsecret) {
        throw new Error("Invalid Client Secret");
      }
      next();
    } catch (e) {
      let errors = Errors.raise("UNAUTHORIZED_ACCESS");
      errors.error.details = e.message || {};
      res.error(errors);
    }
  },
};

module.exports = Auth;
