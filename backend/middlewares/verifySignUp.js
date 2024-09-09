const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
	if (req.body.username) {
		User.findOne({
			where: {
				username: req.body.username,
			},
		})
			.then((user) => {
				if (user) {
					return res.status(400).send({
						message: `Cannot add duplicate. User with name '${req.body.username}' already exists.`,
					});
				}

				//If Username check passes then check the email part
				if (req.body.email) {
					User.findOne({
						where: {
							email: req.body.email,
						},
					}).then((userByEmail) => {
						if (userByEmail) {
							return res.status(400).send({
								message: `Cannot add duplicate. User with email '${req.body.email}' already exists.`,
							});
						}

						//if both passes
						next();
					});
				}
			})
			.catch((err) => {
				res.status(500).send({
					message:
						"Some internal error ocurred in checkDuplicateUsernameOrEmail process ",
				});
			});
	}
};

const checkRolesExisted = (req, res, next) => {
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!ROLES.includes(req.body.roles[i])) {
				return res.status(400).send({
					message: "Failed! Roles does not exist = " + req.body.roles[i],
				});
			}
		}
		/*
        //This can be used instead of for loop
        if (!req.body.roles.every((role) => ROLES.includes(role))) {
            res.status(400).send({ message: "Failed! Roles does not exist", });
        }

        //To send the list of invalid roles along with check
        const invalidRoles = req.body.roles.filter(role => !allowedRoles.includes(role));
        if (invalidRoles.length === 0) {
        console.log('All roles are valid');
        } else {
        return res.status(400).json({ message: 'Some roles are not valid', invalidRoles });
        }
        */
    }
    //If the req body is not provided with roles, still execution should continue as we are assigning user role by default
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
}

module.exports = verifySignUp