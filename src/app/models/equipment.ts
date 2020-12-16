import {Field} from './field';

export class Equipment {
    id: number;
    name: string;
    equipment_type: any;
    files: any[];
    fields: Field[];

    /**
     * @param id The id of the equipment
     * @param name The name of the equipment
     * @param equipment_type The equipment type
     * @param list_of_files The list of possible files describing the equipment
     * @param list_of_fields The list of fields of the equipment
     */
    constructor(id: number,
                name: string,
                equipment_type: any,
                list_of_files: any[],
                list_of_fields: any[],
                ) {
        this.id = id;
        this.name = name;
        this.equipment_type = equipment_type;
        this.files = list_of_files;
        this.fields = list_of_fields;
    }
}
