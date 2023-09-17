import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from './../../services/common.service'
import { ChatService } from './../../services/chat/chat.service';

@Component({
	selector: 'app-chat-app',
	templateUrl: './chat-app.component.html',
	styleUrls: ['./chat-app.component.scss']
})
export class ChatAppComponent implements OnInit {

	public roomId: string;
	public messageText: string;
	public messageArray: { user: string, message: string }[] = [];
	private storageArray = [];

	public showScreen = true;
	public phone: string;
	public pswd: string;
	public currentUser;
	public selectedUser;
	public userdata;
	public user_id_config = {};
	public userList = [];
	constructor(
		private modalService: NgbModal,
		private chatService: ChatService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {
		console.log("in the chat component");
		this.initial()

		this.chatService.getMessage().subscribe((data: any) => {
			console.log("new message", data);
			if(this.roomId == data.room){
				this.messageArray.push(data);
			}
		});
	}

	initial(){
		this.userdata = JSON.parse(<string>localStorage.getItem("chatapp_user_data"));
		this.phone = this.userdata['phone_num']
		console.log('this userdata', this.userdata);

		this.currentUser = this.userdata;
		this.commonService.getAllUsers(this.userdata['id']).then(resp => {
			console.log("User getAllUsers", resp);
			if(resp.result == "success"){
				if('room_ids' in resp) this.currentUser['roomId'] = resp['room_ids'];
				this.userList = resp['data'];
				console.log(this.currentUser, this.userList);
				for (let index = 0; index < this.userList.length; index++) {
					const element = this.userList[index];
					this.user_id_config[element.id] = element;
				}
				this.user_id_config[this.currentUser.id] = this.userdata
			}else{
				alert("Users not found.");
				this.userList = [];
			}
		}).catch(err => {
			alert("Got error while processing the request. Please try again.");
			console.log("Error", err);
		})
	}

	selectUserHandler(phone: string): void {
		this.selectedUser = this.userList.find(user => user.phone_num === phone);
		console.log(this.selectedUser, this.currentUser);

		this.roomId = this.currentUser.roomId[this.selectedUser.id];
		this.messageArray = [];

		this.commonService.getAllMessages(this.currentUser.id, this.selectedUser.id).then(resp => {
			console.log("User getAllMessages", resp, this.user_id_config);
			if(resp.result == "success"){
				let msgsConversation = resp['data'];
				for (let index = 0; index < msgsConversation.length; index++) {
					const element = msgsConversation[index];
					msgsConversation[index]['user'] = this.user_id_config[element['from_user']].username;
					msgsConversation[index]['message'] = element['text'];
				}
				msgsConversation.sort((a:any, b:any) => new Date(a.created_at) - new Date(b.created_at));
				console.log("message: ", msgsConversation);
				this.messageArray = msgsConversation;
			}else{
				alert("Users not found.");
				this.userList = [];
			}
		}).catch(err => {
			alert("Got error while processing the request. Please try again.");
			console.log("Error", err);
		})

		this.storageArray = this.chatService.getStorage();
		const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);

		if (storeIndex > -1) {
			this.messageArray = this.storageArray[storeIndex].chats;
		}

		this.join(this.currentUser.username, this.roomId);
	}

	join(username: string, roomId: string): void {
		this.chatService.joinRoom({user: username, room: roomId});
	}

	sendMessage(): void {
		this.chatService.sendMessage({
			user: this.currentUser.username,
			room: this.roomId,
			message: this.messageText,
			from_user: this.currentUser.id,
			to_user: this.selectedUser.id
		});
		this.messageText = '';
	}

}
