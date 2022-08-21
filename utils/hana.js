require("dotenv").config();
const hana = require("@sap/hana-client");

// enviroment variables
const HANA_HOST = process.env.HANA_HOST;
const HANA_USER = process.env.HANA_USER;
const HANA_PASSWORD = process.env.HANA_PASSWORD;
const HANA_DATABASE = process.env.HANA_DATABASE;
const HANA_STOCK_PROCDURE = process.env.HANA_STOCK_PROCDURE;
const HANA_WAHREHOUSES = process.env.HANA_WAHREHOUSES;

const hanaConfig = {
  serverNode: `${HANA_HOST}:30015`,
  uid: HANA_USER,
  pwd: HANA_PASSWORD,
  sslValidateCertificate: "false",
};

const connection = hana.createConnection();

const getItems = async (whs) => {
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_STOCK_PROCDURE}" ('${whs}')`;
  return execute(procedureStatment).catch(() => {return 'error'});
};

const getwarehouseList = async () => {
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_WAHREHOUSES}"`;
  return execute(procedureStatment).catch(() => {return 'error'});
};

const execute = async (procdure) => {
    return new Promise((resolve, reject) => {
      try {
        connection.connect(hanaConfig, (err) => {
          if (err) {
            console.log(err);
            reject();
          } else {
            const statment = connection.prepare(procdure);
            statment.execute(function (err, results) {
              if (err) {
                console.log(err);
                reject();
              }
              connection.disconnect();
              resolve(results);
            });
          }
        });
      } catch (err) {
        reject();
      }
    });
  };

module.exports = {
    getItems,
    getwarehouseList
}