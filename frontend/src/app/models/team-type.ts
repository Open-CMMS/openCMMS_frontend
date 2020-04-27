export class TeamType {
    id: number;
    name: string;
    permissions: number[];
    teams: number[];

    /**
     *
     * @param name The name of the team type
     * @param permissions The list of the Permissions associated to the GroupType
     * @param teams The list of the teams associated to the GroupType
     */
    constructor(name: string, permissions: number[], teams: number[]) {
        this.name = name;
        this.permissions = permissions;
        this.teams = teams;
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
     * Getter on the permissions list field of the GroupType
     * @returns The permissions list of the GroupType
     */
    getPermissions(): number[] {
        return this.permissions;
    }

    /**
     * Getter on the teams list field of the GroupType
     * @returns The team list of the GroupType
     */
    getTeams(): number[] {
        return this.teams;
    }

    /**
     * Setter on the name field of the Right
     * @param name The new name to set
     */
    setName(name: string) {
        this.name = name;
    }

    /**
     * Setter on the permissions list field of the GroupType
     * @param permissions The new permissions list to set
     */
    setPermissions(permissions: number[]) {
        this.permissions = permissions;
    }

    /**
     * Setter on the teams list field of the GroupType
     * @param teams The new teams list to set
     */
    setTeams(teams: number[]) {
        this.teams = teams;
    }
}
