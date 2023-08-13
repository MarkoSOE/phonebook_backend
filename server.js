const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("build"));

let data = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
	{
		id: 5,
		name: "Slabe Newman",
		number: "39-23-6434122",
	},
];

function generateID() {
	//get the current max id of the array
	const currentMax =
		data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;
	return currentMax + 1;
}

app.get("/api/persons/", (req, res) => {
	res.json(data);
});

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

	if (data.find((item) => item.name === body.name)) {
		return res.status(400).json({
			error: "name must be unique",
		});
	}

	newPerson = {
		id: generateID(),
		name: body.name,
		number: body.number,
	};

	data = data.concat(newPerson);
	res.send(newPerson);
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
