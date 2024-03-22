const db = require("./models");

module.exports = async () => {
  try {
    await db.sequelize.authenticate();
    console.info("connected to postgres");
  } catch (err) {
    console.error("postgres failed to connect");
    console.error(err);
  }
}
  
