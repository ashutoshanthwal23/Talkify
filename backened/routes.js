const router = require("express").Router();
const activateController = require("./controllers/activate-controller");
const authController = require("./controllers/auth-controllers");
const encryptDecyptControllers = require("./controllers/encryptDecypt-controllers");
const roomsController = require("./controllers/rooms-controller");
const { authMiddleware } = require("./middlewares/auth-middleware");
const { multerUpload } = require("./services/multer");


router.post("/api/send-otp", authController.sendOtp)

router.post("/api/verify-otp", authController.verifyOtp);

router.post("/api/activate", multerUpload.single("avatar"), authMiddleware, activateController.activate)

router.get("/api/refresh",  authController.refresh);

router.get("/api/logout", authMiddleware, authController.logout)

router.post("/api/rooms", authMiddleware, roomsController.create)

router.get("/api/rooms", authMiddleware, roomsController.index)

router.get("/api/rooms/:roomId", authMiddleware, roomsController.show)

router.delete("/api/rooms/:roomId", authMiddleware, roomsController.delete)

router.get("/api/profile", authMiddleware, roomsController.clientRoom)

router.post("/api/encrypt", authMiddleware, encryptDecyptControllers.encryptData)

router.get("/encrypted/:encryptedData", authMiddleware, encryptDecyptControllers.decryptData)

module.exports = router;