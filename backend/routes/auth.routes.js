const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");

module.exports = function (app) {
	app.post("/ecom/api/v1/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], [verifySignUp.checkRolesExisted], authController.signup);

	app.post("/ecom/api/v1/auth/signin", authController.signin);
};
