const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO notes VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
      values: [id, title, body, tags, createdAt, updatedAt],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getNotes() {
    const { rows } = await this._pool.query('SELECT * FROM notes');
    return rows.map(mapDBToModel);
  }

  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id=$1',
      values: [id],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title=$1, body=$2, tags=$3, updated_at=$4 WHERE id=$5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'Gagal memperbaharui catatan. Id tidak ditemukan'
      );
    }
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id=$1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal menghapus catatan. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;
