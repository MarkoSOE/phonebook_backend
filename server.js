require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const { request } = require("http");
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
		mongoose.connection.close();
	});
});
// });

app.get("/api/info/", (req, res) => {
	const numberofpeople = Object.keys(data).length;
	const date = new Date();
	res.send(`Phonebook has info for ${numberofpeople} people\n${date}`);
});

app.get("/api/persons/:id", (req, res) => {
	const result = data.filter((obj) => {
		return obj.id === Number(req.params.id);
	});

	if (!result || Object.keys(result).length === 0) {
		return res.status(400).json({
			error: "missing content",
		});
	}
	res.json(result);
});

app.delete("/api/persons/:id", (req, res, next) => {
	Contact.findByIdAndRemove(req.params.id)
		.then((contact) => {
			if (contact) {
				res.json(contact);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.post("/api/persons/", (req, res) => {
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

	newContact.save().then((result) => {
		console.log("contact saved!");
		res.json(newContact);
	});
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
