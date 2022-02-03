const router = require('express').Router();
const apiController = require('../controllers/ApiTestController');
const { uploadSingle, uploadMultiple, uploadSingleFix } = require('../middlewares/multer');

router.get('/galeri', apiController.ViewGaleri);
router.post('/galeri', uploadMultiple, apiController.addGaleri);
// router.put('/galeri/:id', uploadSingleFix ,apiController.updateOneGaleri);
router.delete('/galeri/:id', apiController.deleteGaleri);
//setoran wajib
router.post('/setoranwajib', apiController.addSetoranWajib);
router.get('/setoranwajib', apiController.ViewSetoranWajib);
router.get('/setoranwajib/:id', apiController.ViewSetoranWajibByUser);
router.put('/setoranwajib', apiController.updateOneSetoranWajib);
router.delete('/setoranwajib/:id', apiController.deleteSetoranWajib);
//login
router.post('/signUp',uploadSingle,apiController.actionSignUp);
router.post('/sign', apiController.actionSignin);
//formulir
router.post('/formulir', uploadSingle, apiController.AddformDaftar)
router.get('/formulir', apiController.ViewFormDaftar)
router.put('/formulir', uploadSingle, apiController.updateOneFormDaftar)
router.delete('/formulir/:id', apiController.deleteFormDaftar)
//profile
router.get('/member', apiController.ViewDataProfile)
router.get('/member/:id', apiController.ViewDataProfileById)
router.post('/member', uploadSingle, apiController.updateDataProfile)
router.put('/member', uploadSingle, apiController.updateOneDataProfile)
router.delete('/member/:id', apiController.deleteDataProfile)
module.exports = router;
