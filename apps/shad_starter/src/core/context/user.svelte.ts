export class User {
	name = $state('');
	email = $state('');

	constructor(name: string, email: string) {
		this.name = name;
		this.email = email;
	}
}
