var dbObj = require('./db')

// example
async function getConnectedUsers(user){
    try{
        const resp = await dbObj.query(`select id,room_id,user1,user2 from rooms where (user1 = ${user}) or (user2 = ${user})`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in getAllUser");
        return null;
    }
}

async function getUsersInfo(userList){
    try{
        const resp = await dbObj.query(`select id,username,phone_num,image from userdb where id in (${userList})`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in getUsersInfo");
        return null;
    }
}

async function checkUser(phone_num, pswd) {
    try {
        const resp = await dbObj.query(`select id,username,cookie,image from userdb where (phone_num = '${phone_num}' and userpswd = '${pswd}')`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in checkUser");
        return null;
    }
}

async function authUser(id, cookie) {
    try {
        const resp = await dbObj.query(`select username from userdb where id = ${id} and cookie = '${cookie}'`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in authUser");
        return null;
    }
}

async function getRoomId(user1, user2) {
    try {
        const resp = await dbObj.query(`select id,room_id from rooms where (user1 = ${user1} and user2 = ${user2}) or (user1 = ${user2} and user2 = ${user1})`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in getRoomId");
        return null;
    }
}

async function getMessages(user1, user2) {
    try {
        const resp = await dbObj.query(`select id,text,from_user,to_user,created_at from messages where (from_user = ${user1} and to_user = ${user2}) or (from_user = ${user2} and to_user = ${user1})`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in getMessages");
        return null;
    }
}

async function addMessage(from_user, to_user, text) {
    try {
        const resp = await dbObj.query(`insert into messages (from_user,to_user,text) values (${from_user},'${to_user}','${text}')`);
        return JSON.parse(JSON.stringify(resp));
    } catch (error) {
        console.log("## ERROR in createTask");
        return null;
    }
}

module.exports = {
    getConnectedUsers, checkUser, authUser, getRoomId, getMessages, addMessage, getUsersInfo
}