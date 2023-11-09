const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("1234", 8);

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    { username: "dale", password: hash },
    { username: "dawn", password: hash },
    { username: "bobby", password: hash },
  ]);
};