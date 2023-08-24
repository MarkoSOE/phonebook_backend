require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const { request } = require("http");
const { error } = require("console");
const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
	origin: "*",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("build"));

function generateID() {
	//get the current max id of the array
	const currentMax =
		data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;
	return currentMax + 1;
}

app.get("/api/persons/", (req, res) => {
	Contact.find({}).then((result) => {
		console.log(result);
		res.json(result);
	});
});

app.get("/api/info/", (req, res) => {
	const numberofpeople = Object.keys(data).length;
	const date = new Date();
	res.send(`Phonebook has info for ${numberofpeople} people\n${date}`);
});

app.get("/api/persons/:id", (req, res, next) => {
	Contact.findById(req.params.id)
		.then((contact) => {
			if (contact) {
				res.json(contact);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Contact.findByIdAndRemove(req.params.id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((error) => {
			next(error);
		});
});

app.post("/api/persons/", (req, res, next) => {
	const body = req.body;
	console.log(body);

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "content missing",
		});
	}

	const newContact = new Contact({
		name: body.name,
		number: body.number,
	});

	newContact
		.save()
		.then((result) => {
			console.log("contact saved!");
			res.json(newContact);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body;

	const contact = {
		name: body.name,
		number: body.number,
	};

	Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
		.then((updatedContact) => {
			res.json(updatedContact);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
	console.error(error.message);
	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" });
	}

	next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
