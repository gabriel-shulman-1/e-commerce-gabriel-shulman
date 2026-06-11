const mongoose = require("mongoose");

const RETRY_DELAY_MS = 15000;

const getMongoUri = () => {
  const mongoUser = process.env.MONGO_DB_USER || "gesover_db_user";
  const mongoPass = process.env.MONGO_DB_PASSWORD || "";
  const encodedPass = encodeURIComponent(mongoPass);

  return `mongodb://${mongoUser}:${encodedPass}@cluster0.m9sroh3.mongodb.net/?appName=Cluster0`;
};

const connectMongo = async () => {
  try {
    await mongoose.connect(getMongoUri());
    console.log("conectado a Mongo Atlas");
  } catch (error) {
    console.error("No se pudo conectar a Mongo Atlas:", error.message || error);
    console.log(`Reintentando conexion a Mongo Atlas en ${RETRY_DELAY_MS / 1000} segundos...`);

    setTimeout(connectMongo, RETRY_DELAY_MS);
  }
};

module.exports = connectMongo;
