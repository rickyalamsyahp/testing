const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  foto: {
    type: String,
  },
  namalengkap: {
    type: String,
  },
  email: {
    type: String,
  },
  nomerAnggota: {
    type: String,
  },
  nomerTelepon: {
    type: String,
  },
  nomerPegawaiPertamina: {
    type: String,
  },
  noKtp: {
    type: String,
  },
  tanggalLahir: {
    type: String,
  },
  fotoKtp: {
    type: String,
  }
})

module.exports = mongoose.model('Member', memberSchema)