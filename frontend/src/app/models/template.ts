export class Template {
    id: number;
    name: string;
    description?: string;
    end_date?: string; // au format YYY-MM-DD
    duration?: string; // au format X days, hh:mm:ss
    is_template = true;
    equipment?: any;
    teams?: any[];
    files?: any[];
    end_conditions?: any[];

    /**
     * Constructor of the Task object
     * @param id the id of the task
     * @param name the name of the task
     * @param description a short description of the task
     * @param end_date the deadline of the task
     * @param duration the estimated time to realise the task
     * @param equipment the equipment concerned by the task
     * @param teams the teams that have to realise the task
     * @param files the files describing the task
     */
    constructor(
        id: number,
        name: string,
        description?: string,
        end_date?: string,
        duration?: string,
        equipment?: any,
        teams?: any[],
        files?: any[],
        end_conditions?: any[]) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.end_date = end_date;
            this.duration = duration;
            this.equipment = equipment;
            this.teams = teams;
            this.files = files;
            this.end_conditions = end_conditions;
        }
}
