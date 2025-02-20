export class Auth {
	isAuthenticated = $state(false);

	constructor() {
		this.isAuthenticated = false;
	}

	login() {
		this.isAuthenticated = true;
	}

	logout() {
		this.isAuthenticated = false;
	}
}
