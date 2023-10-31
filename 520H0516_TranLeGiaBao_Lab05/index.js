const express = require("express");
require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const studentApi = require("./student-api");
const port = process.env.PORT;
const SUCCESS_CODE = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(expressLayouts);
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
	})
);

app.set("view engine", "ejs");

app.use(function (req, res, next) {
	if (req.session.flash) {
		res.locals.flash = req.session.flash;
		delete req.session.flash;
	}

	next();
});

// app.get("/reset", (req, res) => {
//     studentApi.resetData((data) => {
//         if (data.success) { // Adjust this condition based on your API's response
//             req.session.flash = {
//                 message: `Data reset successfully`,
//             };
//             return res.redirect("/");
//         } else {
//             req.session.flash = {
//                 message: `Failed to reset data: ${data.message}`,
//             };
//             return res.redirect("/");
//         }
//     });
// });

app.get("/add", (req, res) => {
	if (req.session.error) {
		let error = req.session.error;
		delete req.session.error;

		return res.render("add", { title: "Thêm sinh viên", error });
	}

	return res.render("add", { title: "Thêm sinh viên", error: "" });
});

app.post("/add", (req, res) => {
	let student = {
		id: req.body.id,
		fullName: req.body.name,
		gender: req.body.gender,
		age: parseInt(req.body.age),
		email: req.body.email,
	};

	studentApi.addStudent(student, (result) => {
		if (result.code === SUCCESS_CODE) {
			req.session.flash = { name: req.body.name, message: result.message };
			return res.redirect("/");
		}

		req.session.error = result.message;
		return res.redirect("add");
	});
});

app.get("/detail/:id", (req, res) => {
	let id = req.params.id;

	studentApi.getDetail(id, (student) => {
		return res.render("detail", { title: "Chi tiết sinh viên", ...student });
	});
});

app.get("/", (req, res) => {
	studentApi.getStudents((students) => {
		return res.render("index", { title: "Danh sách sinh viên", students });
	});
});

app.delete("/delete/:id", (req, res) => {
	let id = req.params.id;

	studentApi.deleteStudent(id, (data) => {
		// Data doesn't have code mean it delete successfully
		// Because delete successfully => api return student information
		if (!data.code) {
			req.session.flash = {
				message: `Delete successfully`,
			};

			return res.status(200).json({ code: 1, msg: "Delete successfully" });
		}

		return res.status(404).json(data);
	});
});

app.patch("/update/:id", (req, res) => {
	let student = { ...req.body };

	studentApi.updateStudent(req.params.id, student, (data) => {
		return res.status(200).json(data);
	});
});

app.listen(port, () => {
	console.log("Listen at http://localhost:" + port);
});
