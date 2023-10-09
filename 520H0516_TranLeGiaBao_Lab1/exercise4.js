window.onload = function () {
	loadDataFromStorage();

	var localBtn = document.getElementById("local");
	var sessionBtn = document.getElementById("session");

	function loadDataFromStorage() {
		let localStorageLength = localStorage.length;
		let sessionStorageLength = sessionStorage.length;

		if (localStorageLength >= 1) {
			for (let i = 0; i < localStorageLength; i++) {
				let studentId = i + 1;
				let key = localStorage.getItem(studentId);

				// key's data is a student object
				if (typeof key !== "object") {
					let { fullName, age } = JSON.parse(key);

					addStudent(fullName, age, "localStorage");
				}
			}
		}

		if (sessionStorageLength >= 1) {
			for (let i = 0; i < sessionStorageLength; i++) {
				let studentId = i + 1;
				let key = sessionStorage.getItem(studentId);

				if (typeof key !== "object") {
					let { fullName, age } = JSON.parse(key);

					addStudent(fullName, age, "sessionStorage");
				}
			}
		}
	}

	function checkValidation() {
		var fullNameBox = document.getElementById("name");
		var ageBox = document.getElementById("age");
		var fullName = fullNameBox.value;
		var age = ageBox.value;

		if (fullName === "" || age === "") {
			alert("Please enter your name or age");
			return true;
		}

		return { fullName, age };
	}

	function processValidation(e) {
		if (typeof checkValidation() === "boolean") {
			e.preventDefault;
		} else {
			var { fullName, age } = checkValidation();

			addStudent(fullName, age, e.target.id);
		}
	}

	localBtn.addEventListener("click", (e) => {
		processValidation(e);
	});

	sessionBtn.addEventListener("click", (e) => {
		processValidation(e);
	});

	function addStudent(name, age, id) {
		let value = `{"fullName": "${name}", "age": ${age}}`;

		// if click button localStorage
		if (id.includes("local")) {
			let localTbody = $("#local-tbody");
			let orderNumber = localTbody[0].childElementCount + 1;

			let student = `
          <tr>
            <td>${orderNumber}</td>
            <td>${name}</td>
            <td>${age}</td>
          </tr>
        `;

			localTbody.append(student);

			const LENGTH_SET_LOCAL = 5; // 5 means "local" instead of "localStorage"

			// If not equal to, just show on the table, not add into storage
			if (id.length == LENGTH_SET_LOCAL) {
				localStorage.setItem(orderNumber, value);
			}
		} else {
			let sessionTbody = $("#session-tbody");
			let orderNumber = sessionTbody[0].childElementCount + 1;

			let student = `
          <tr>
            <td>${orderNumber}</td>
            <td>${name}</td>
            <td>${age}</td>
          </tr>
        `;

			sessionTbody.append(student);

			const LENGTH_SET_SESSION = 7; // 7 means the length of "session" instead of "sessionStorage"

			// If not equal to, just show on the table, not add into storage
			if (id.length == LENGTH_SET_SESSION) {
				sessionStorage.setItem(orderNumber, value);
			}
		}

		$("#name").val("");
		$("#age").val("");
	}
};
