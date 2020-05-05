export class Task {
    id: number;
    name: string;
    description: string;
    end_date: Date;
    time: Date;
    is_template: boolean;
    equipment: number;
    teams: number[];
    task_type: number;
    files: number[];
    over: boolean;

    /**
     * Constructor of the Task object
     * @param id the id of the task
     * @param name the name of the task
     * @param description a short description of the task
     * @param end_date the deadline of the task
     * @param time the estimated time to realise the task
     * @param is_template a boolean to know if this task is a task template
     * @param equipment the equipment concerned by the task
     * @param teams the teams that have to realise the task
     * @param task_type the type of task
     * @param files the files describing the task
     * @param over a boolean indicating is the task is finished
     */
    constructor(
        id: number,
        name: string,
        description: string,
        end_date: Date,
        time: Date,
        is_template: boolean,
        equipment: number,
        teams: number[],
        task_type: number,
        files: number[],
        over: boolean) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.end_date = end_date;
            this.time = time;
            this.is_template = is_template;
            this.equipment = equipment;
            this.teams = teams;
            this.task_type = task_type;
            this.files = files;
            this.over = over;
        }
}
