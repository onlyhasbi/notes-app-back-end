const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username=$1',
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length > 0) {
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

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('user gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id,username,fullname FROM users WHERE id=$1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('user id tidak ditemukan');
    }

    return rows[0];
  }
}

module.exports = UserService;
