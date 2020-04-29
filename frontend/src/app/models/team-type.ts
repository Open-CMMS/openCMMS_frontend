export class TeamType {
    id: number;
    name: string;
    perms: number[];
    team_set: number[];

    /**
     *
     * @param id The id of the team type
     * @param name The name of the team type
     * @param perms The list of the Permissions associated to the GroupType
     * @param team_set The list of the team_set associated to the GroupType
     */
    constructor(id: number, name: string, perms: number[], team_set: number[]) {
        this.id = id;
        this.name = name;
        this.perms = perms;
        this.team_set = team_set;
    }

    /**
     * Getter on the id field of the GroupType
     * @returns The id of the GroupType
     */
    getId(): number {
        return this.id;
    }

    /**
     * Getter on the name field of the GroupType
     * @returns The name of the GroupType
     */
    getName(): string {
        return this.name;
    }

    /**
     * Getter on the perms list field of the GroupType
     * @returns The perms list of the GroupType
     */
    getPermissions(): number[] {
        return this.perms;
    }

    /**
     * Getter on the team_set list field of the GroupType
     * @returns The team list of the GroupType
     */
    getTeams(): number[] {
        return this.team_set;
    }

    /**
     * Setter on the name field of the Right
     * @param name The new name to set
     */
    setName(name: string) {
        this.name = name;
    }

    /**
     * Setter on the perms list field of the GroupType
     * @param perms The new perms list to set
     */
    setPermissions(perms: number[]) {
        this.perms = perms;
    }

    /**
     * Setter on the team_set list field of the GroupType
     * @param team_set The new team_set list to set
     */
    setTeams(team_set: number[]) {
        this.team_set = team_set;
    }
}
