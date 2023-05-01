const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id,username,fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id,password FROM users WHERE username=$1',
      values: [username],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    const { id, password: hashedPassword } = rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    return id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username=$1',
      values: [username],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount) {
      throw new ClientError(
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('user gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id,username,fullname FROM users WHERE id=$1',
      values: [id],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('user id tidak ditemukan');
    }

    return rows[0];
  }
}

module.exports = UsersService;
