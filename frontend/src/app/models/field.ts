export class Field {
  id: number ;
  name: string;
  value: string[];
  description: string;

  /**
   * @param id The id of the field
   * @param name The name of the field
   * @param value The value of the field
   * @param description The description of the field
   */
  constructor(id: number, name: string, value: string[], description: string) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.description = description;
  }
}
