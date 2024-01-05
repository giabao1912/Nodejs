const createError = require("http-errors");
const { express, app, server, io } = require("./io");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");

require("dotenv").config();

const { SERVER_HOST, DB_HOST, DATABASE, PORT, COOKIE_SECRET } = process.env;

const AccountRouter = require("./routers/AccountRouter");
const ChatRouter = require("./routers/ChatRouter");
const IndexRouter = require("./routers/IndexRouter");

app.set("view engine", "ejs");

app.use(
	session({
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	req.vars = { root: __dirname }; // __dirname is current folder
	next();
});

app.use("/", IndexRouter);
app.use("/account", AccountRouter);
app.use("/chat", ChatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error", { layout: false });
});

mongoose
	.set("strictQuery", false)
	.connect(`mongodb://${DB_HOST}/${DATABASE}`)
	.then(() =>
		server.listen(PORT, () => console.log(`http://${SERVER_HOST}:${PORT}`))
	)
	.catch(() => console.log("Connect error!"));
