export class Team {
    id: number;
    name: string;
    team_type: number;
    user_set: number[];

    constructor(id: number, name: string, team_type: number, user_set: number[]) {
        this.id = id;
        this.name = name;
        this.team_type = team_type;
        this.user_set = user_set;
    }
}
