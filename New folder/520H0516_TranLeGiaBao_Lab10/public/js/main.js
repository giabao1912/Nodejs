function updateStatus(account) {
	const userElement = document.getElementById(account._id);
	const statusElement = userElement.querySelector(".status");

	if (account.status === "Offline") {
		statusElement.innerHTML =
			'<div class="badge badge-warning badge-pill">Đang bận</div>';

		showOfflineNotification(account.name);
	} else {
		statusElement.innerHTML =
			'<div class="badge badge-success badge-pill">Đang rảnh</div>';

		showOnlineNotification(account.name);
	}
}

function showOnlineNotification(name) {
	// Get the online notification element
	const onlineNotification = document.getElementById("online-notification");

	// Update the text of the notification to show the name of the user who came online
	onlineNotification.innerHTML = `<strong>${name}</strong> vừa mới online`;

	// Show the notification
	onlineNotification.classList.add("show");

	// Hide the notification after 5 seconds
	setTimeout(() => {
		onlineNotification.classList.remove("show");
	}, 5000);
}

function showOfflineNotification(name) {
	// Get the offline notification element
	const offlineNotification = document.getElementById("offline-notification");

	// Update the text of the notification to show the name of the user who went offline
	offlineNotification.innerHTML = `<strong>${name}</strong> đã thoát khỏi ứng dụng`;

	// Show the notification
	offlineNotification.classList.add("show");

	// Hide the notification after 5 seconds
	setTimeout(() => {
		offlineNotification.classList.remove("show");
	}, 5000);
}

const conversationBox = document.querySelector(".conversation");
conversationBox.scrollTop = conversationBox.scrollHeight;

// show chat
function showChat(message, type) {
	const messageDiv = document.createElement("div");
	messageDiv.className = "message " + type;

	messageDiv.textContent = message;

	const span = document.createElement("span");
	span.className = "time";
	span.textContent = "8:59";

	messageDiv.appendChild(span);

	conversationBox.appendChild(messageDiv);
	conversationBox.scrollTop = conversationBox.scrollHeight;
}
