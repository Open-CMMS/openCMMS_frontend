export class Task {
    id: number;
    name: string;
    description: string;
    end_date?: string; // au format YYY-MM-DD
    duration?: string; // au format X days, hh:mm:ss
    is_template = false;
    equipment?: any;
    teams?: any[];
    files?: any[];
    over?: boolean;
    trigger_conditions?: any[];
    end_conditions?: any[];

    /**
     * Constructor of the Task object
     * @param id the id of the task
     * @param name the name of the task
     * @param description a short description of the task
     * @param end_date the deadline of the task
     * @param duration the estimated time to realise the task
     * @param is_template a boolean to know if this task is a task template
     * @param equipment the equipment concerned by the task
     * @param teams the teams that have to realise the task
     * @param files the files describing the task
     * @param over a boolean indicating is the task is finished
     * @param trigger_conditions the trigger conditions of the task
     * @param end_conditions the end conditions of the task
     */
    constructor(
        id: number,
        name: string,
        description: string,
        end_date?: string,
        duration?: string,
        is_template?: boolean,
        equipment?: number[],
        teams?: number[],
        files?: number[],
        over?: boolean,
        trigger_conditions?: any[],
        end_conditions?: any[]) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.end_date = end_date;
            this.duration = duration;
            this.is_template = is_template;
            this.equipment = equipment;
            this.teams = teams;
            this.files = files;
            this.over = over;
            this.trigger_conditions = trigger_conditions;
            this.end_conditions = end_conditions;
        }
}
