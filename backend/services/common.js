const dbObjProxy = require('../services/query')

async function getRoomID(user1, user2) {
    let resp = await dbObjProxy.getRoomId(user1, user2).then(resp => {
		return resp;
	})
	console.log("Resp in logout: ", resp);
	if(resp && resp.length){
		return resp[0].room_id;
	}
    return null;
}

async function addMessage(from_user, to_user, text) {
    let resp = await dbObjProxy.addMessage(from_user, to_user, text).then(resp => {
		return resp;
	})
	console.log("Resp in logout: ", resp);
	if(resp){
		return true;
	}
    return false;
}

module.exports = {
    getRoomID, addMessage
}