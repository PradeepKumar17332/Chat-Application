var express = require('express');
var router = express.Router();
const dbObjProxy = require('../services/query')

router.use(async function(req, res, next){
    console.log("inside the auth middleware");
    const resp = await dbObjProxy.authUser(req.body.id, req.body.cookie).then(resp => {return resp});
    console.log("Resp in auth middleware: ", resp);
    if(resp.length == 0)
        res.json({"result":"fail.auth", "data":[], "msg":"Authorization failed."})
    // res.username = resp[0].username;
    else next();
})

router.all('/getAllMessages', async function(req, res, next) {
	const user1 = req.body.user1, user2 = req.body.user2;
	console.log("Fired SQL");
	await dbObjProxy.getMessages(user1, user2).then(resp => {
		console.log("Resp: ", resp);
		if (resp) {
			res.json({
				result:"success", 
				msg:"Successfully fetched messages.", 
				data: resp
			})
		}else{
			res.json({
				result:"failed", 
				msg:"Got some error while fetching messages. Please try again.", 
				data:[]
			})
		}
	});
});

module.exports = router;