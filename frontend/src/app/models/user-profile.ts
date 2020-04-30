export class UserProfile {
    id: number;
    last_name: string;
    first_name: string;
    username: string;
    email: string;
    password: string;
    nb_tries: number;
    is_active: boolean;

    /**
     * @param id The id of the user
     * @param lastName The user's last name
     * @param firstName The user's firt name
     * @param username The username of the user
     * @param email The user's email
     * @param password The user's password
     * @param nbTries The number of consecutive unsuccessful login tries for the user
     * @param isActive boolean that show if a user is connected
     */
    constructor(id: number,
                lastName: string,
                firstName: string,
                username: string,
                email: string,
                password: string,
                nbTries: number,
                isActive: boolean) {
    this.id = id;
    this.last_name = lastName;
    this.first_name = firstName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.nb_tries = nbTries;
    this.is_active = isActive;
}
}



