import {Field} from './field';
import {Equipment} from './equipment';

export class DataProvider {
  id: number;
  name: string;
  file_name: string;
  recurrence: any;
  is_activated: boolean;
  equipment: Equipment;
  ip_address: string;
  port: number;
  field_object: Field;

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
    file_name: string,
    recurrence: any,
    is_activated: boolean,
    equipment: Equipment,
    ip_address: string,
    port: number,
    field_object: Field) {
      this.id = id;
      this.name = name;
      this.file_name = file_name;
      this.recurrence = recurrence;
      this.is_activated = is_activated;
      this.equipment = equipment;
      this.ip_address = ip_address;
      this.port = port;
      this.field_object = field_object;
    }
}
