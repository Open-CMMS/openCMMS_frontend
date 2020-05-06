export class EquipmentType {
    id: number;
    name: string;
    equipment_set: number[];

    /**
     *
     * @param id The id of the equipment type
     * @param name The name of the equipment type
     * @param equipment_set The list of the equipment_set associated to the EquipmentType
     */
    constructor(id: number, name: string, equipment_set: number[]) {
        this.id = id;
        this.name = name;
        this.equipment_set = equipment_set;
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
     * Getter on the equipment_set list field of the EquipmentType
     * @returns The equipment list of the EquipmentType
     */
    getEquipments(): number[] {
        return this.equipment_set;
    }

    /**
     * Setter on the name field of the Right
     * @param name The new name to set
     */
    setName(name: string) {
        this.name = name;
    }

    /**
     * Setter on the equipment_set list field of the EquipmentType
     * @param equipment_set The new equipment_set list to set
     */
    setEquipments(equipment_set: number[]) {
        this.equipment_set = equipment_set;
    }
}
