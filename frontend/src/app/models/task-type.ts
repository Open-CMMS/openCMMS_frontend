export class TaskType {
    id: number;
    name: string;
    fields_groups: number[];
    tasks: number[];

    /**
     * Constructor of the TaskType object
     * @param id the id of the task type
     * @param name the name of the task type
     * @param fields_groups the fields_groups of the task type
     * @param tasks the tasks inheriting from this task type
     */
    constructor(id: number,
                name: string,
                fields_groups: number[],
                tasks: number[]) {
                    this.id = id;
                    this.name = name;
                    this.fields_groups = fields_groups;
                    this.tasks = tasks;
                }
}
