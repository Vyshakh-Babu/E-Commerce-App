//Role model for authentication

module.exports = (seq, Sequelize) => {
	const Role = seq.define("roles", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
		},
	});
	return Role;
};