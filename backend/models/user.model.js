// User model for authentication

module.exports = (seq, Sequelize) => {
	const User = seq.define("users", {
		username: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
	});
	return User;
};
