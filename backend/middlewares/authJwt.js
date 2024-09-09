const db = require("../models");
const User = db.user;
const config = require("../configs/auth.config");
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
	let token = req.headers["x-access-token"]; //Retrieves the JWT from the x-access-token header in the HTTP request.

	if (!token) {
		//403 Forbidden Access
		return res.status(403).send({
			message: "No token provided",
		});
	}

	//jwt.verify(token, secretOrPublicKey, [options, callback]);
	// token: The JWT to be verified.
	// secretOrPublicKey: The secret key or public key for verifying the signature of the JWT.
	// options (optional): An object specifying options for verification. Common options include algorithms, issuer, subject, audience, etc.
	// callback: A callback function that will be called with the decoded payload or an error.
	// Nb: err below is part of callback function
	jwt.verify(token, config.secret, (err, decodedUser) => {
		if (err) {
			//401 Unauthorized - lacks valid authentication credentials
			return res.status(401).send({
				message: "Unauthorized user",
			});
		}

		//If the token is valid, it extracts info from decoded token and attaches it to the req object. This can be used in subsequent middleware or route handlers.
		console.log("Token verified");
		req.userId = decodedUser.id;
		next();
	});
};

isAdmin = (req, res, next) => {
	//(req.userId) extracted from the JWT payload in verifyToken method.
	User.findByPk(req.userId).then((user) => {
		// In Sequelize, the getRoles() method is automatically generated for associations when defining a Many-to-Many relationship between models. This method is used to fetch the associated roles of a user.
		user.getRoles().then((roles) => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "admin") {
					console.log("Admin role verified");
					return next(); //exit the current function immediately after calling next() else get error
				}
			}

			//Forbidden Access
			return res.status(403).send({
				message: "Required Admin Role",
			});
		});
	});
};

const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
};

module.exports = authJwt;