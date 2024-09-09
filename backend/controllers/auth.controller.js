const db = require("../models");
const config = require("../configs/auth.config"); //contains the secret key info
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
	User.create({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	})
		.then((user) => {
			if (req.body.roles) {
				//findAll method always returns an array, even if only one record is found.
				Role.findAll({
					where: {
						name: {
							[Op.or]: req.body.roles,
						},
					},
				})
					.then((roles) => {
						if (!roles) {
							user.setRoles([1]).then(() => {
								console.log("Entered user role not found");
								return res.send({
									message:
										"User registered with role 'user' by default successfully",
								});
							});
						}
						user.setRoles(roles).then(() => {
							res.send({
								message: "User registered successfully",
							});
						});
					})
					.catch((err) => {
						console.log(`Error message: ${err.message}`);
						res.status(500).send({
							message:
								"Some internal error occurred while finding the user roles",
						});
					});
			} else {
				user.setRoles([2]).then(() => {
					res.send({
						message: "User registered with role 'user' by default successfully",
					});
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};

exports.signin = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username,
		},
	})
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					message: `User '${req.body.username}' not found`,
				});
			}

			// Compare the provided password with the stored hashed password
			var passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					message: "Invalid Password",
				});
			}

			// If username and password are valid, generate a JWT. jwt.sign is method used for creating JWTs.
			//jwt.sign(payload, secretOrPrivateKey, [options, callback])
			//options (optional): This is an object that can include various options for customizing the behavior of the JWT. One common option is expiresIn, which specifies the expiration time of the token.
			//callback (optional): If provided, the jwt.sign function will call this callback with the resulting JWT. If not provided, the function will return a promise.
			var token = jwt.sign({ id: user.id }, config.secret, {
				expiresIn: 86400, //24 hrs
			});

			res.status(200).send({
				id: user.id,
				username: user.username,
				email: user.email,
				accessToken: token,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};