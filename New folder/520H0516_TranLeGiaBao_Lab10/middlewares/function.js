const Account = require("../models/Account");
const Chat = require("../models/Chat");

exports.updateStatus = async (accountId, status) => {
	try {
		await Account.findByIdAndUpdate(accountId, { status });
	} catch (error) {
		console.log(error);
	}
};

exports.getProfilePictureCharacter = (name) => {
	const words = name.split(" ");
	const lastWord = words[words.length - 1];
	return lastWord.charAt(0);
};

exports.getAccountById = async (id) => {
	let account = [];

	try {
		account = await Account.findById(id).select("-__v -password");
	} catch (error) {
		console.log(error);
	}

	return account;
};

exports.getChatsBetweenUsers = async (currentUserId, currentPartnerId) => {
	let chats = await Chat.find({
		$or: [
			{
				senderId: currentUserId,
				receiverId: currentPartnerId,
			},
			{
				senderId: currentPartnerId,
				receiverId: currentUserId,
			},
		],
	}).select("-__v");

	return chats;
};
