export class Team {
    id: number;
    name: string;
    team_type: number;
    user_set: number[];

    /**
     * Constructor of the Team object
     * @param id the id of the team
     * @param name the name of the team
     * @param team_type the team type id of the team
     * @param user_set the user's ids of the team
     */
    constructor(id: number, name: string, team_type: number, user_set: number[]) {
        this.id = id;
        this.name = name;
        this.team_type = team_type;
        this.user_set = user_set;
    }
}
