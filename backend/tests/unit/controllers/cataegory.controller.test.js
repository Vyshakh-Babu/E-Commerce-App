const { beforeEach } = require("node:test");
const categoryController = require("../../../controllers/category.controller");
const Model = require("../../../models");
const CategoryModel = Model.category;
const newCategory = require("../../mock-data/new-category.json");
const { mockRequest, mockResponse } = require("../interceptor");

let req, res;

beforeAll(() => {
	req = mockRequest();
	res = mockResponse();
});

describe("categoryController.create", () => {

	beforeAll(() => {
		req.body = newCategory;
	});

	test("should call categoryController.create and create a new category", async () => {
		//Mocking model command
		const spy = jest.spyOn(CategoryModel, "create")
			.mockImplementation((newCategory) => Promise.resolve(newCategory));

		//executing controller command - create is the exports.create
		await categoryController.create(req, res);

		//test to verify the create function
		expect(spy).toHaveBeenCalled();
		expect(CategoryModel.create).toHaveBeenCalledWith(newCategory);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(newCategory);
	});

	test("should call categoryController.create and ends with an error", async () => {
        req.body = {};
		const spy = jest.spyOn(CategoryModel, "create")
			.mockImplementation(() => Promise.reject(Error("This is an error")));

		await categoryController.create(req, res);

		await expect(spy).toHaveBeenCalled();
		await expect(CategoryModel.create).toHaveBeenCalledWith(req.body);
		await expect(res.status).toHaveBeenCalledWith(500);
		await expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error while storing the category"
        });
	});
});

describe("categoryController.findAll", () => {
	test("should call categoryController.findAll with a query value", async () => {
		const queryParam = {
			where: {
				name: "Electronics",
			},
		};

		const spy = jest
			.spyOn(CategoryModel, "findAll")
			.mockImplementation((queryParam) => Promise.resolve(newCategory));

		req.query = {
			name: "Electronics",
		};

		await categoryController.findAll(req, res);

		expect(spy).toHaveBeenCalled();
		expect(CategoryModel.findAll).toHaveBeenCalledWith(queryParam);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(newCategory);
	});
});
