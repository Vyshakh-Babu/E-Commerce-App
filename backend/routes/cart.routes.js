const { authJwt } = require("../middlewares");
const cartController = require("../controllers/cart.controller");

module.exports = function(app){
    app.post("/ecom/api/v1/carts", [authJwt.verifyToken], cartController.create);

    app.get("/ecom/api/v1/carts/:cartId", [authJwt.verifyToken], cartController.getCart);

    app.put("/ecom/api/v1/carts/:id", [authJwt.verifyToken], cartController.update);

    app.delete("/ecom/api/v1/carts/:id", [authJwt.verifyToken], cartController.delete);

    app.put("/ecom/api/v1/carts/:id/status", [authJwt.verifyToken], [authJwt.isAdmin], cartController.updateStatus);
}