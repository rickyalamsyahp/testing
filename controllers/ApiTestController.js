const Users = require("../models/Users");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");
const Galeri = require("../models/Galeri");
const SetoranWajib = require("../models/SetoranWajib");
const FormDaftar = require("../models/FormDaftar");
const Member = require("../models/Member");

module.exports = {
  //crud sign
  actionSignUp: async (req, res) => {
    try {
      const { nama, password, alamat, email, noPegawaiPertamina, noTlpn } =
        req.body;
      var newUser = new Users({
        nama: nama,
        password: password,
        alamat: alamat,
        email: email,
        noPegawaiPertamina: noPegawaiPertamina,
        noTlpn: noTlpn,
      });
      await Users.findOne({ nama: newUser.nama })
        .then(async (profile) => {
          if (!profile) {
            bcrypt.hash(newUser.password, 10, async (err, hash) => {
              if (err) {
                console.log("Error is", err.message);
              } else {
                newUser.password = hash;
                await newUser
                  .save()
                  .then(() => {
                    res.status(200).send(newUser);
                  })
                  .catch((err) => {
                    res.status(500).json({ message: err });
                  });
                  1
              }
            });
          } else {
            res.send("User already exists...");
          }
        })
        .catch((err) => {
          res.status(500).json({ message: err });
        });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email: email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          res.status(200).json({
            message: "Login successful",
            data: {
              nama: user.nama,
              alamat: user.alamat,
              email: user.email,
              noPegawaiPertamina: user.noPegawaiPertamina,
              noTlpn: user.noTlpn,
            },
          });
        } else {
          res.status(400).json({ error: "Invalid Password" });
        }
      } else {
        res.status(401).json({ error: "User does not exist" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Galeri
  addGaleri: async (req, res) => {
    Promise.all(
      req.files.map(async (file) => {
        const newUpload = new Galeri({
          imageUrl: `images/${file.filename}`,
        });
        await newUpload.save();

        res.status(200).json({
          data: imageSave,
        });
      })
    )
      .then(res.status(201).json("files successfully uploaded"))
      .catch((e) => {
        res
          .status(500)
          .json({ message: "Something went wrong in /uploads/img", error: e });
      });
  },

  ViewGaleri: async (req, res) => {
    try {
      const galeri = await Galeri.find();
      res.status(200).json({
        data: galeri,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },



  deleteGaleri: async (req, res) => {
    try {
      const { id } = req.params;
      const galeri = await Galeri.findOne({ _id: id });
      // await fs.unlink(path.join(`public/${member.fotoKtp}`));
      // await fs.unlink(path.join(`public/${member.foto}`));
      await galeri.remove();
      res.status(200).json({
        message: "Data Berhasil Terhapus",
      });
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },

  //Setoran Wajib
  addSetoranWajib: async (req, res) => {
    try {
      const { tanggal, deskripsi } = req.body;
      await SetoranWajib.create({
        tanggal: tanggal,
        deskripsi: deskripsi,
      });
      res.status(200).json({
        message: "Data Berhasil Ditambah",
      });
    } catch (error) {
      res.send(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  ViewSetoranWajib: async (req, res) => {
    try {
      const setoranWajib = await SetoranWajib.find();
      res.status(200).json({
        data: setoranWajib,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateOneSetoranWajib: async (req, res) => {
    try {
      const { id, tanggal, deskripsi } = req.body;
      const updateOne = await SetoranWajib.findOne({ _id: id });
      updateOne.tanggal = tanggal;
      updateOne.deskripsi = deskripsi;
      await updateOne.save();
      res.status(200).json({
        message: "Data Berhasil Terupdate",
        updateOne,
      });
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },

  deleteSetoranWajib: async (req, res) => {
    try {
      const { id } = req.params;
      const setoranWajib = await SetoranWajib.findOne({ _id: id });
      // await fs.unlink(path.join(`public/${member.fotoKtp}`));
      // await fs.unlink(path.join(`public/${member.foto}`));
      await setoranWajib.remove();
      res.status(200).json({
        message: "Data Berhasil Terhapus",
      });
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },

  //formDaftar
  AddformDaftar: async (req, res) => {
    try {
      const { nama, alamatRumah, alamatPangkalan } = req.body;
      const newItem = {
        nama,
        alamatRumah,
        alamatPangkalan,
        imageKtp: `image/${req.files.imageKtp[0].filename}`,
        imageKeteranganUsaha: `image/${req.files.imageKeteranganUsaha[0].filename}`,
        imageSuratTeraTimbangan: `image/${req.files.imageSuratTeraTimbangan[0].filename}`,
        imageKelengkapanSarana: `image/${req.files.imageKelengkapanSarana[0].filename}`,
      };
      const daftar = await FormDaftar.create(newItem);
      res.status(200).json({
        message: "Formulir Berhasil Ditambah",
        daftar,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  ViewFormDaftar: async (req, res) => {
    try {
      const formdaftar = await FormDaftar.find();
      res.status(200).json({
        data: formdaftar,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateOneFormDaftar: async (req, res) => {
    try {
      const { id, nama, alamatRumah, alamatPangkalan } = req.body;
      const updateOne = await FormDaftar.findOne({ _id: id });
      if (req.file == undefined) {
        updateOne.nama = nama;
        updateOne.alamatRumah = alamatRumah;
        updateOne.alamatPangkalan = alamatPangkalan;
        await updateOne.save();
        res.status(200).json({
          message: "Data Berhasil Terupdate",
          updateOne,
        });
      } else {
        await fs.unlink(path.join(`public/${updateOne.imageKtp}`));
        await fs.unlink(path.join(`public/${updateOne.imageKeteranganUsaha}`));
        await fs.unlink(
          path.join(`public/${updateOne.imageSuratTeraTimbangan}`)
        );
        await fs.unlink(
          path.join(`public/${updateOne.imageKelengkapanSarana}`)
        );
        updateOne.nama = nama;
        updateOne.alamatRumah = alamatRumah;
        updateOne.alamatPangkalan = alamatPangkalan;
        (updateOne.imageKtp = `image/${req.files.imageKtp[0].filename}`),
          (updateOne.imageKeteranganUsaha = `image/${req.files.imageKeteranganUsaha[0].filename}`),
          (updateOne.imageSuratTeraTimbangan = `image/${req.files.imageSuratTeraTimbangan[0].filename}`),
          (updateOne.imageKelengkapanSarana = `image/${req.files.imageKelengkapanSarana[0].filename}`),
          await updateOne.save();
        res.status(200).json({
          message: "Data Berhasil Terupdate",
          update,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },

  deleteFormDaftar: async (req, res) => {
    try {
      const { id } = req.params;
      const formDaftar = await FormDaftar.findOne({ _id: id });
      // await fs.unlink(path.join(`public/${member.fotoKtp}`));
      // await fs.unlink(path.join(`public/${member.foto}`));
      await formDaftar.remove();
      res.status(200).json({
        message: "Data Berhasil Terhapus",
      });
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },

  //profile
  ViewDataProfile: async (req, res) => {
    try {
      const member = await Member.find();
      res.status(200).json({
        data: member,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  ViewDataProfileById: async (req, res) => {
    try {

      const member = await Member.find({_id: req.params.id});
      res.status(200).json({
        data: member,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateDataProfile: async (req, res) => {
    try {
      const {
        namalengkap,
        email,
        nomerAnggota,
        nomerTelepon,
        nomerPegawaiPertamina,
        noKtp,
        tanggalLahir,
      } = req.body;
      const newItem = {
        namalengkap,
        email,
        nomerAnggota,
        nomerTelepon,
        nomerPegawaiPertamina,
        noKtp,
        tanggalLahir,
        fotoKtp: `image/${req.files.imageKtp[0].filename}`,
        foto: `image/${req.files.fotoProfile[0].filename}`,
      };
      const update = await Member.create(newItem);
      res.status(200).json({
        message: "Data Berhasil Terupdate",
        update,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  updateOneDataProfile: async (req, res) => {
    try {
      const {
        id,
        namalengkap,
        email,
        nomerAnggota,
        nomerTelepon,
        nomerPegawaiPertamina,
        noKtp,
        tanggalLahir,
      } = req.body;
      const updateOne = await Member.findOne({ _id: id });
      if (req.file == undefined) {
        updateOne.namalengkap = namalengkap;
        updateOne.email = email;
        updateOne.nomerAnggota = nomerAnggota;
        updateOne.nomerTelepon = nomerTelepon;
        updateOne.nomerPegawaiPertamina = nomerPegawaiPertamina;
        updateOne.noKtp = noKtp;
        updateOne.tanggalLahir = tanggalLahir;
        await updateOne.save();
        res.status(200).json({
          message: "Data Berhasil Terupdate",
          updateOne,
        });
      } else {
        await fs.unlink(path.join(`public/${updateOne.fotoKtp}`));
        await fs.unlink(path.join(`public/${updateOne.foto}`));
        updateOne.namalengkap = namalengkap;
        updateOne.email = email;
        updateOne.nomerAnggota = nomerAnggota;
        updateOne.nomerTelepon = nomerTelepon;
        updateOne.nomerPegawaiPertamina = nomerPegawaiPertamina;
        updateOne.noKtp = noKtp;
        updateOne.tanggalLahir = tanggalLahir;
        updateOne.fotoKtp = `image/${req.files.imageKtp[0].filename}`;
        (updateOne.foto = `image/${req.files.fotoProfile[0].filename}`),
          await updateOne.save();
        res.status(200).json({
          message: "Data Berhasil Terupdate",
          update,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },

  deleteDataProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await Member.findOne({ _id: id });
      // await fs.unlink(path.join(`public/${member.fotoKtp}`));
      // await fs.unlink(path.join(`public/${member.foto}`));
      await member.remove();
      res.status(200).json({
        message: "Data Berhasil Terhapus",
      });
    } catch (error) {
      res.status(500).json({ message: "internal error", error });
    }
  },
};
