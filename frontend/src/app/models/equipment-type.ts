export class EquipmentType {
    id: number;
    name: string;
    field: any[];
    equipments: any[];
    /**
     *
     * @param id The id of the equipment type
     * @param name The name of the equipment type
     * @param field The fields of the equipment type
     */

    // const dictionary: { [fieldName: string]: string }
    constructor(id: number, name: string, field: any[]) {
        this.id = id;
        this.name = name;
        this.field = field;
    }

    /**
     * Getter on the id field of the EquipmentType
     * @returns The id of the EquipmentType
     */
    getId(): number {
        return this.id;
    }

    /**
     * Getter on the name field of the EquipmentType
     * @returns The name of the EquipmentType
     */
    getName(): string {
        return this.name;
    }

    /**
     * Setter on the name field of the Right
     * @param name The new name to set
     */
    setName(name: string) {
        this.name = name;
    }

    /**
     * Getter on the dictionary fields of the EquipmentType
     */
    getFields(): any[] {
        return this.field;
    }

    /**
     * Setter on the dictionary fields of the EquipmentType
     * @param fields Array of fields.
     */
    setField(fields: any[]) {
        this.field = fields;
    }

    /**
     * Getter on the table equipments of the EquipmentType
     */
    getEquipments(): any[] {
        return this.equipments;
    }

    /**
     * Setter on the table equipments of the EquipmentType
     * @param equipments Array of equipments
     */
    setEquipments(equipments: any[]) {
        this.equipments = equipments;
    }
}
