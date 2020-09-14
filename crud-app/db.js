const mysql = require('mysql');

const conn = mysql.createPool({
  connectionLimit: 10,
  password: '',
  user:'root',
  database:'seattlegrace',
  host: '127.0.0.1',
  port: '3306'
});

let sghdb = {};

sghdb.all = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM doctors ORDER BY d_id ASC`, (err, results) => {
      if(err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

sghdb.add = (fname, lname, position, specialty, imagename, username) => {
  let q = "INSERT INTO doctors (first_name, last_name, position, specialty, image, username) VALUES ('"+fname+"', '"+lname+"', '"+position+"', '"+specialty+ "', '" +imagename+ "', '" +username+ "')";

  conn.query(q, (err, result) => {
    if(err) {
      return reject(err);
    }
  });
};

sghdb.edit = (id, fname, lname, position, specialty) => {
  let q = "UPDATE `players` SET `first_name` = '" +fname+ "', `last_name` = '" +lname+ "', `position` = '"+position+ "', `specialty` = '" +specialty+"' WHERE `doctors`.`d_id` = '" +id+ "'";
  
  conn.query(q, (err, result) => {
    if(err) {
      return reject(err);
    }
    return resolve(result[0]);
  });
};

sghdb.delete = (id) => {
  let q = 'DELETE FROM players WHERE d_id = "'+id+'"';

  conn.query(q, (err, result) => {
    if(err) {
      return reject(err);
    }
    return resolve(result[0]);
  });
};

sghdb.one = (id) => {
  let q = 'SELECT * FROM `doctors` WHERE d_id ="'+id+'"'; 

  conn.query(q, (err, result) => {
    if(err) {
      return reject(err);
    }
    return resolve(result[0]);
  });
};

sghdb.find = (username) => {
  let q = 'SELECT * FROM doctors WHERE username="'+username+'"';

  conn.query(q, (err, result) => {
    if(err) {
      return reject(err);
    }
    return resolve(result);
  });
}

module.exports = sghdb;
