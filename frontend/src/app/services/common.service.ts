import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class CommonService {
	private baseurl = "http://localhost:3000/";

	constructor(private http : HttpClient) { }

	login(phone_num:string , pswd:string){
		const param = new HttpParams()
			.set("phone_num",phone_num)
			.set("userpswd",pswd);
		return this.http.post<any>(this.baseurl + "user/login", param).toPromise();
	}

	getAllUsers(user:any){
		const param = new HttpParams()
			.set("id",<string>localStorage.getItem("chatapp_user_id"))
			.set("cookie",<string>localStorage.getItem("chatapp_cookie"))
			.set("user",user);
		return this.http.post<any>(this.baseurl + "user/allusers", param).toPromise();
	}

	getAllMessages(user1:any, user2:any){
		const param = new HttpParams()
			.set("id",<string>localStorage.getItem("chatapp_user_id"))
			.set("cookie",<string>localStorage.getItem("chatapp_cookie"))
			.set("user1",user1)
			.set("user2", user2);
		return this.http.post<any>(this.baseurl + "messages/getAllMessages", param).toPromise();
	}

	logout(){
		const param = new HttpParams()
			.set("id",<string>localStorage.getItem("chatapp_user_id"))
			.set("cookie",<string>localStorage.getItem("chatapp_cookie"));
		return this.http.post<any>(this.baseurl + "user/logout", param).toPromise();
	}

}
