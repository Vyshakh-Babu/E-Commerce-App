// While testing a controller, we need to make sure that the request object contains all the desired parameters 
// and body object and response object also has all the desired parameters.

// idea is to mimic the structure of a real HTTP request object and provide simple, mockable methods for accessing request parameters and body.

module.exports = {
	mockRequest: () => {
		const req = {};
		req.body = jest.fn().mockReturnValue(req); // ensures that when these functions are called, they return the same req object.
		req.params = jest.fn().mockReturnValue(req);
		return req;
	},

	mockResponse: () => {
		const res = {};
		res.send = jest.fn().mockReturnValue(res);
		res.status = jest.fn().mockReturnValue(res);
		res.json = jest.fn().mockReturnValue(res);
		return res;
	},
};