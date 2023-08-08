"use strict";
const TAG = "[TestController]";
const { raw } = require("body-parser");
const rekuire = require("rekuire");
const Logger = rekuire("Logger");
const Errors = rekuire("Errors");
const MySql = rekuire("TestMySQL");

function TestController(req, res) {
  this.req = req;
  this.res = res;
}

TestController.prototype.sampleGet = function (cb, result) {
  const limit = this.req.query?.limit || 1000;
  const page = this.req.query?.page || 1;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) as totalCount FROM developer.visitors`;
  const dataQuery = `SELECT * FROM developer.visitors LIMIT ${limit} OFFSET ${offset}`;

  const getCount = MySql.execute(countQuery);
  const getData = MySql.execute(dataQuery);

  Promise.all([getCount, getData])
    .then(([countResult, dataResult]) => {
      const totalCount = countResult[0].totalCount;
      const records = dataResult;
      if (records.length < 1) {
        let errors = Errors.raise("MISSING_INVALID_PARAMS");
        return cb(errors, null);
      }
      return cb(null, { records, totalCount, page });
    })
    .catch((error) => {
      let errors = Errors.raise("INTERNAL_SERVER_ERROR");
      errors.error.details = error.message || {};

      return cb(errors, null);
    });
};

TestController.prototype.samplePost = function (cb, result) {
  const rawBody = this.req.body || {};

  let body = {
    firstName: rawBody.firstName,
    lastName: rawBody.lastName,
    contact: rawBody.contact, // Assuming you have a 'contact' field
    purpose: rawBody.purpose,
    vehicleOrWalk: rawBody.selectedOption,
    status: true,
  };

  if (!body.firstName || !body.lastName || !body.contact || !body.purpose || !body.vehicleOrWalk) {
    let errors = Errors.raise("MISSING_INVALID_PARAMS");
    return cb(errors, null);
  }

  const dataQuery = `
    INSERT INTO developer.visitors 
    (firstName, lastName, contact, purpose, vehicleOrWalk, status) 
    VALUES 
    ('${body.firstName}', '${body.lastName}', '${body.contact}', '${body.purpose}', '${body.vehicleOrWalk}', ${body.status});
  `;

  const insertData = MySql.execute(dataQuery);
  insertData
    .then((result) => {
      if (result.affectedRows < 1) {
        let errors = Errors.raise("MISSING_INVALID_PARAMS");
        return cb(errors, null);
      }
      return cb(null, { message: "Successfully registed a visitor" });
    })
    .catch((error) => {
      let errors = Errors.raise("INTERNAL_SERVER_ERROR");
      errors.error.details = error.message || {};

      return cb(errors, null);
    });
};

TestController.prototype.samplePut = function (cb, result) {
  const rawBody = this.req.body || {};

  let body = {
    transactionId: rawBody.transactionId,
    status: rawBody.status,
  };

  if (!body.transactionId) {
    let errors = Errors.raise("MISSING_INVALID_PARAMS");
    return cb(errors, null);
  }

  const dataQuery = `Update developer.visitors SET status = '${body.status}' WHERE transactionId = ${body.transactionId};`;
  const getData = MySql.execute(dataQuery);

  getData
    .then((result) => {
      if (result.affectedRows < 1) {
        let errors = Errors.raise("MISSING_INVALID_PARAMS");
        return cb(errors, null);
      }
      return cb(null, { message: "Successfully updated a visitor" });
    })
    .catch((error) => {
      let errors = Errors.raise("INTERNAL_SERVER_ERROR");
      errors.error.details = error.message || {};

      return cb(errors, null);
    });
};

module.exports = TestController;
