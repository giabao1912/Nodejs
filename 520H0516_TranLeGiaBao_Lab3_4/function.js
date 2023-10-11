
const fs = require('fs');
const { body, validationResult } = require("express-validator");
function checkProductValidation(name, price, image, err, desc) {
	let errorMsg = "";

	if (!name) {
		errorMsg = "Please enter name";
	} else if (!price) {
		errorMsg = "Please enter price";
	} else if (!image) {
		errorMsg = "Wrong image";
	} else if (err) {
		errorMsg = "Image too large";
	} else if (!desc) {
		errorMsg = "Please enter description";
	}

	return errorMsg;
}


//Function to add flash messages
function addFlashMessage(req, type, message) {
    req.session.flashMessages = req.session.flashMessages || [];
    req.session.flashMessages.push({ type, message });
}

function redirectToLogin(req, res, next) {
	if (!req.session.login) {
		return res.redirect("/login");
	}

	next();
}

function redirectToHome(req, res, next) {
	if (req.session.login) {
		return res.redirect("/");
	}

	next();
}


module.exports = {
    checkProductValidation,
    addFlashMessage,
	redirectToHome,
	redirectToLogin
};