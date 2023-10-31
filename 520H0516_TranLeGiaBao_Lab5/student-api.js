const fetch = require("node-fetch");
const api = process.env.API;
// const resetApi = process.env.API + "/reset";

module.exports = {
	getStudents: (callback) => {
		fetch(api)
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				callback(json);
			});
	},
	addStudent: (student, callback) => {
		fetch(api, {
			method: "POST",
			body: JSON.stringify(student),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((json) => {
				callback(json);
			});
	},
	getDetail: (id, callback) => {
		fetch(api + `/${id}`)
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				callback(json);
			});
	},
	deleteStudent: (id, callback) => {
		fetch(api + `/${id}`, {
			method: "delete",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				callback(json);
			});
	},
	updateStudent: (id, student, callback) => {
		fetch(api + `/${id}`, {
			method: "PATCH",
			body: JSON.stringify(student),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				callback(json);
			});
	},
    // resetData: (callback) => {
    //     fetch(resetApi, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //     .then((res) => res.json())
    //     .then((json) => {
    //         callback(json);
    //     })
    //     .catch((error) => {
    //         console.error('Error resetting data:', error);
    //         callback({ success: false, message: 'Error occurred while resetting data' });
    //     });
    // }
};
