import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatAppComponent } from './components/chat-app/chat-app.component';
// import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
	{path: '', component: LoginComponent},
	{path: 'chatApp', component: ChatAppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
