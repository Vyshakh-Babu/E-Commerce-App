//Cart model for checkout of products

module.exports = (seq, Sequelize) => {
	const Cart = seq.define("cart", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		status: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		//removed as we are calculating cost dynamically now
		// cost: {
		// 	type: Sequelize.INTEGER,
		// },
	});

	return Cart;
};