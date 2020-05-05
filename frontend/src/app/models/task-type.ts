export class TaskType {
    id: number;
    name: string;
    fields: number[];
    tasks: number[];

    /**
     * Constructor of the TaskType object
     * @param id the id of the task type
     * @param name the name of the task type
     * @param fields the fields of the task type
     * @param tasks the tasks inheriting from this task type
     */
    constructor(id: number,
                name: string,
                fields: number[],
                tasks: number[]) {
                    this.id = id;
                    this.name = name;
                    this.fields = fields;
                    this.tasks = tasks;
                }
}
