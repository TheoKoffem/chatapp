const pg = require('pg');
const moment = require('moment');
const { request } = require('express');
const process_db = require("dotenv").config();
const db_url = process.env.DATABASE_URL || process_db.parsed.DB_URL;
const client = new pg.Client({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false }
})
client.connect();

//Get all chats from database
const getChats = room => {
    return new Promise((resolve, reject) => {
      client.query('SELECT * FROM chats WHERE room = $1 LIMIT 10', [room])
        .then(res => {
          resolve(res.rows);
          res.rows.forEach(element => {
          });
        })
        .catch(err => {
          reject(err);
        });
    })
  }

//Insert chats naar database 
const insertChats = (request) => {
    const data = request;

    client.query("INSERT INTO chats (user_name, room, chat_text, date_time) VALUES ($1, $2, $3, $4)",
        [data.name, data.room, data.text, data.date], (error, results) => {
            if (error) {
                throw error
            }
            console.log(`Chat added to room: ${data.room}`);
        })
}

const formatMessage = (name, text) => {
    return {
        name,
        text,
        date: moment().format('DD MM YYYY hh:mm')
    };
}
const users = [];

const userJoin = (id, username, room) => {
    const user = { id, username, room };

    users.push(user);

    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    getChats,
    insertChats,
    formatMessage,
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}