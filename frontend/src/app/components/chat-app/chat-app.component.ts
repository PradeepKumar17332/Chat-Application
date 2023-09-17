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
	// public userList = [
	// 	{
	// 		id: 1,
	// 		name: 'The Swag Coder',
	// 		phone: '9876598765',
	// 		image: 'assets/user/user-1.png',
	// 		roomId: {
	// 			2: 'room-1',
	// 			3: 'room-2',
	// 			4: 'room-3'
	// 		}
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Wade Warren',
	// 		phone: '9876543210',
	// 		image: 'assets/user/user-2.png',
	// 		roomId: {
	// 			1: 'room-1',
	// 			3: 'room-4',
	// 			4: 'room-5'
	// 		}
	// 	},
	// 	{
	// 		id: 3,
	// 		name: 'Albert Flores',
	// 		phone: '9988776655',
	// 		image: 'assets/user/user-3.png',
	// 		roomId: {
	// 			1: 'room-2',
	// 			2: 'room-4',
	// 			4: 'room-6'
	// 		}
	// 	},
	// 	{
	// 		id: 4,
	// 		name: 'Dianne Russell',
	// 		phone: '9876556789',
	// 		image: 'assets/user/user-4.png',
	// 		roomId: {
	// 			1: 'room-3',
	// 			2: 'room-5',
	// 			3: 'room-6'
	// 		}
	// 	}
	// ];
	public userList = [];
	constructor(
		private modalService: NgbModal,
		private chatService: ChatService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {
		console.log("in the chat component");
		this.initial()
		// this.phone = '9876598765';
		// this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
		// this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());
		// console.log(this.currentUser, this.userList);

		this.chatService.getMessage().subscribe((data: { user: string, room: string, message: string }) => {
			// this.messageArray.push(data);
			if (this.roomId) {
				setTimeout(() => {
					this.storageArray = this.chatService.getStorage();
					const storeIndex = this.storageArray
					.findIndex((storage) => storage.roomId === this.roomId);
					this.messageArray = this.storageArray[storeIndex].chats;
				}, 500);
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
			}else{
				alert("Users not found.");
				this.userList = [];
			}
		}).catch(err => {
			alert("Got error while processing the request. Please try again.");
			console.log("Error", err);
		})
	}

	openPopup(content: any): void {
		this.modalService.open(content, {backdrop: 'static', centered: true});
	}

	login(dismiss: any): void {
		let num = this.phone.toString();
		let pswd = this.pswd.toString();
		if(!num || !pswd){
			alert("Please fill the required fields");
			return;
		}

		// this.commonService.login(num, pswd).then(resp => {
		this.commonService.login('1234567890', 'abc').then(resp => {
			console.log("User login resp", resp);
			if(resp.result == "success"){
				localStorage.setItem("chatapp_user_id", resp.data[0].id);
				localStorage.setItem("chatapp_cookie", resp.data[0].cookie);
				localStorage.setItem("chatapp_user_data", JSON.stringify(resp.data[0]));
				// this.route.navigate(["/todolist"]);
			}else{
				alert("User not found. Please give right creds.");
				return;
			}
		}).catch(err => {
			alert("Got error while processing the request. Please try again.");
			console.log("Error", err);
		})
		this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
		this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

		if (this.currentUser) {
			this.showScreen = true;
			dismiss();
		}
	}

	selectUserHandler(phone: string): void {
		this.selectedUser = this.userList.find(user => user.phone_num === phone);
		console.log(this.selectedUser, this.currentUser);
		
		this.roomId = this.currentUser.roomId[this.selectedUser.id];
		this.messageArray = [];

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
			message: this.messageText
		});

		this.storageArray = this.chatService.getStorage();
		const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);

		if (storeIndex > -1) {
			this.storageArray[storeIndex].chats.push({
				user: this.currentUser.username,
				message: this.messageText
			});
		} else {
			const updateStorage = {
				roomId: this.roomId,
				chats: [{
				user: this.currentUser.username,
				message: this.messageText
				}]
			};

			this.storageArray.push(updateStorage);
		}

		this.chatService.setStorage(this.storageArray);
		this.messageText = '';
	}

}
