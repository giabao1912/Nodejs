function askDelete(id) {
	let aTag = $(`a[href='/detail/${id}'`);
	let name = aTag.html();

	$("#confirm-name").html(name).attr("uid", id);
}

function doDelete() {
	let id = $("#confirm-name").attr("uid");

	$.ajax({
		url: "/delete/" + id,
		type: "DELETE",
		dataType: "json",
	})
		.done((data) => {
			if (data.code === 1) {
				window.location.reload();
			}
		})
		.fail((jqXHR, textStatus) => {
			console.log(jqXHR);
		});
}

function checkGender(gender) {
	if (gender === "male") {
		$("#male").prop("checked", true);
	} else {
		$("#female").prop("checked", true);
	}
}

function getGender() {
	if ($("#male").is(":checked")) {
		return "male";
	}

	return "female";
}

$("#btn-update").click(() => {
	let id = $("#id").val();
	let name = $(`#s-name`).val();
	let email = $("#email").val();
	let gender = getGender();
	let age = $("#age").val();

	let student = {
		fullName: name,
		email,
		gender,
		age,
	};

	$.ajax({
		url: "/update/" + id,
		type: "PATCH",
		dataType: "json",
		data: student,
	})
		.done((data) => {
			window.location.reload();
		})
		.fail((jqXHR, textStatus) => {
			console.log(jqXHR);
		});
});

function showDialog(name) {
	let alert = $("#flash-alert");

	if (alert.css("display") === "none") {
		alert.css("display", "block");

		// show deleted user
		$("#name").html(name);
	}

	setTimeout(() => {
		alert.fadeOut(2000);
	}, 1000);
}
