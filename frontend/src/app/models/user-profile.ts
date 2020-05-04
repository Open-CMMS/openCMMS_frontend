export class UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    nb_tries: number;
    is_active: boolean;

    /**
     * @param id The id of the user
     * @param username The username of the user
     * @param firstName The user's firt name
     * @param lastName The user's last name
     * @param email The user's email
     * @param password The user's password
     * @param nbTries The number of consecutive unsuccessful login tries for the user
     * @param isActive boolean that show if a user is connected
     */
    constructor(id: number,
                username: string,
                firstName: string,
                lastName: string,
                email: string,
                password: string,
                nbTries: number,
                isActive: boolean) {
    this.id = id;
    this.username = username;
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.password = password;
    this.nb_tries = nbTries;
    this.is_active = isActive;
    }
}



