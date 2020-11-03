import {Field} from './field';
import {Equipment} from './equipment';

export class DataProvider {
  id: number;
  name: string;
  fileName: string;
  recurrence: any;
  activated: boolean;
  equipment: Equipment;
  equipment_IP: string;
  concerned_field: Field;

  /**
   * Constructor of the DataProvider object
   * @param id the id of the DataProvider
   * @param name the name of the DataProvider
   * @param file the name of the file associated with the DataProvider
   * @param recurrence the recurrence of the DataProvider
   * @param activated a boolean to know if the DataProvider is activated
   * @param equipment the equipment linked to the DataProvider
   * @param equipment_IP the ip of the equipment
   * @param concerned_field the field concerned by the DataProvider
   */
  constructor(
    id: number,
    name: string,
    fileName: string,
    recurrence: any,
    activated: boolean,
    equipment: Equipment,
    equipment_IP: string,
    concerned_field: Field) {
      this.id = id;
      this.name = name;
      this.fileName = fileName;
      this.recurrence = recurrence;
      this.activated = activated;
      this.equipment = equipment;
      this.equipment_IP = equipment_IP;
      this.concerned_field = concerned_field;
    }
}
