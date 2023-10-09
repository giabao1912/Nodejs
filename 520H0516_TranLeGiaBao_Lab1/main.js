function showImg() {
	let url = document.getElementById("url").value;
	let aTag = document.querySelector("a");

	if (url === "") {
		alert("Please enter your url");
		return;
	}

	let request = new XMLHttpRequest();

	request.responseType = "blob";

	request.onload = function () {
		if (this.readyState === 4 && this.status === 200) {
			let img = document.getElementById("img");
			let imageUrl = URL.createObjectURL(this.response);
			aTag.href = img.src = imageUrl;
		}
	};

	request.open("GET", url, true);
	request.send();
}

async function showImgByAsyncAwait() {
	let url = document.getElementById("url").value;
	let imgTag = document.querySelector("#img");

	if (url === "") {
		alert("Please enter your url");
		return;
	}

	try {
		let data = await loadRequest(url);
		let objectUrl = URL.createObjectURL(data);

		imgTag.src = objectUrl;
	} catch (error) {
		alert(error);
	}
}

function showImgByPromise() {
	let url = document.getElementById("url").value;
	let imgTag = document.querySelector("#img");

	if (url === "") {
		alert("Please enter your url");
		return;
	}

	loadRequest(url)
		.then((data) => {
			let objectUrl = URL.createObjectURL(data);

			imgTag.src = objectUrl;
		})
		.catch((error) => {
			alert(error);
		});
}

function loadRequest(url) {
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();

		request.responseType = "blob";

		request.onload = function () {
			// status successful
			if (this.readyState === 4 && this.status === 200) {
				resolve(this.response);
			} else {
				reject(Error(request.statusText));
			}
		};

		request.onerror = function () {
			reject(Error("Error fetching data."));
		};

		request.open("GET", url, true);
		request.send();
	});
}

function loadStudents(data) {
	let tbody = $("#tbsv");

	tbody.empty();

	for (const student of data) {
		let item = `<tr>
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
    </tr>`;

		tbody.append(item);
	}
}

function loadByFetch() {
	fetch("https://web-502070.web.app/lab1/students.json")
		.then((response) => response.json())
		.then((json) => {
			loadStudents(json.data);
		});
}

function loadByAjax() {
	let request = new XMLHttpRequest();

	request.onload = function () {
		if (this.readyState === 4 && this.status === 200) {
			let json = JSON.parse(this.response);

			loadStudents(json.data); // data: element 3 of json file
		}
	};

	request.open("GET", "https://web-502070.web.app/lab1/students.json", true);

	request.send();
}
