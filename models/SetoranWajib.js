const mongoose = require("mongoose");

const setoranWajibSchema = new mongoose.Schema({
  tanggal: {
    type: Date,
  },
  deskripsi: {
    type: String,
  },
});

module.exports = mongoose.model("SetoranWajib", setoranWajibSchema);
