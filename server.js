require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
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
		res.json(result);
	});
	mongoose.connection.close();
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

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	data = data.filter((note) => note.id !== id);
	res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
	const body = req.body;
	console.log(body);

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "content missing",
		});
	}
	const current_list = Contact.find({});

	if (current_list.find((item) => item.name === body.name)) {
		return res.status(400).json({
			error: "name must be unique",
		});
	}

	const newContact = new Contact({
		name: body.name,
		number: body.number,
	});

	newContact.save().then((result) => {
		console.log("contact saved!");
		mongoose.connection.close();
	});

	res.send(newPerson);
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
