import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CommonService } from './../../services/common.service';
import { ChatService } from './../../services/chat/chat.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	@ViewChild('popup', {static: false}) popup: any;
	public phone:string;
	public pswd:string;
	public showScreen = false;
	constructor(
		private route : Router,
		private modalService: NgbModal,
		private chatService: ChatService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		this.openPopup(this.popup);
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

		this.commonService.login(num, pswd).then(resp => {
		// this.commonService.login('1234567890', 'abc').then(resp => {
			console.log("User login resp", resp);
			if(resp.result == "success"){
				localStorage.setItem("chatapp_user_id", resp.data[0].id);
				localStorage.setItem("chatapp_cookie", resp.data[0].cookie);
				localStorage.setItem("chatapp_user_data", JSON.stringify(resp.data[0]));
				dismiss();
				this.showScreen = true;
				this.route.navigate(["/chatApp"]);
			}else{
				alert("User not found. Please give right creds.");
			}
		}).catch(err => {
			alert("Got error while processing the request. Please try again.");
			console.log("Error", err);
		})
		// this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
		// this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

		// if (this.currentUser) {
		// 	this.showScreen = true;
		// 	dismiss();
		// }
	}
}
