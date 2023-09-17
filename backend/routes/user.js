var express = require('express');
var router = express.Router();
const dbObjProxy = require('../services/query')

// router.use(async function(req, res, next){
//     console.log("inside the auth middleware");
//     const resp = await dbObjProxy.authUser(req.body.id, req.body.cookie).then(resp => {return resp});
//     console.log("Resp in auth middleware: ", resp);
//     if(resp.length == 0)
//         res.json({"result":"fail.auth", "data":[], "msg":"Authorization failed."})
//     // res.username = resp[0].username;
//     else next();
// })

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('User route');
});

router.all('/allusers', async function(req, res, next) {
	const user = req.body.id;
	const resp = await dbObjProxy.getConnectedUsers(user);
	console.log("resp in alluser: ", resp)
	let temp_user_list = [];
	if(!resp){
		res.json({
			result:"failed", 
			msg:"user not found. Please try again.", 
			data:[]
		});
	}else if(resp.length == 0){
		res.json({
			result:"success", 
			msg:"no connected user", 
			data:[]
		});
	}else{
		let user_roomids = {};
		resp.forEach(element => {
			// console.log(element);
			if(element.user1 != user){
				temp_user_list.push(element.user1)
				user_roomids[element.user1] = element.room_id;
			}
			else{
				temp_user_list.push(element.user2)
				user_roomids[element.user2] = element.room_id;
			}
		});
		const resp1 = await dbObjProxy.getUsersInfo(temp_user_list);
		console.log("resp in getUsersInfo: ", resp1)
		res.json({
			result:"success", 
			msg:"Successfully got all users.", 
			data: resp1,
			room_ids: user_roomids
		})
	}
	
})

router.all('/login', async function(req, res, next) {
	const phone_num = req.body.phone_num, userpswd = req.body.userpswd;
	console.log("Fired SQL");
	await dbObjProxy.checkUser(phone_num, userpswd).then(resp => {
		console.log("Resp: ", resp);
		if (resp && resp.length == 1) {
			res.json({
				result:"success", 
				msg:"Successfully loged in.", 
				data:[{id:resp[0].id, cookie:resp[0].cookie, username:resp[0].username, phone_num:phone_num, image:resp[0].image}]
			})
		}else{
			res.json({
				result:"failed", 
				msg:"user not found. Please try again.", 
				data:[]
			})
		}
	});
	// res.send('Requested for login');
	
});

router.all('/logout', async (req, res, next) => {
	const id = req.body.id, cookie = req.body.cookie;
	let resp = await dbObjProxy.authUser(id, cookie).then(resp => {
		return resp;
	})
	console.log("Resp in logout: ", resp);
	if(resp && resp.length){
		resp.json({result:"success", data:[], msg:"User logged out successfully."})
	}else{
		resp.json({"result":"fail.auth", "data":[], "msg":"Authorization failed."})
	}
});

module.exports = router;
