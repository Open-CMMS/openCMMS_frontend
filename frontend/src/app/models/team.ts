export class Team {
    id: number;
    name: string;
    team_type: number;

    constructor(id: number, name: string, team_type: number) {
        this.id = id;
        this.name = name;
        this.team_type = team_type;
    }
}
