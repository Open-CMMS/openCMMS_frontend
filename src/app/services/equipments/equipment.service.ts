import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Equipment } from '../../models/equipment';
import { Subject, Observable } from 'rxjs';
import {Field} from '../../models/field';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private equipments: Equipment[] = [];
  equipmentsSubject = new Subject<Equipment[]>();

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getEquipments();
  }

  /**
   * Function that updates the subject usersSubject
   */
  emitEquipments() {
    this.equipmentsSubject.next(this.equipments);
  }

  /**
   * Getter on the List of all equipments saved on the server's database
   */
  getEquipments() {
    this.equipments = [];
    this.httpClient.get<any[]>(this.BASE_URL_API + '/api/maintenancemanagement/equipments/')
                  .subscribe(
                    (response) => {
                      response.forEach(element => {
                        const equipment = new Equipment(element.id, element.name, element.equipment_type, element.files, element.field);
                        this.equipments.push(equipment);
                      });
                      this.emitEquipments();
                    },
                  );
  }

  /**
   * Getter on a specific equipment saved on the server's database
   * @param id the id attribut of a equipment
   * @return the specific Equipment
   */
  getEquipment(id: number ): Observable<any> {
    return this.httpClient
      .get<any>(this.BASE_URL_API + '/api/maintenancemanagement/equipments/' + id + '/');
  }

  /**
   * Fonction to update a existing equipment in the database
   * @param equipmentModified Equipment concerned with the modification and with modifications applied
   */
  updateEquipment(equipmentModified: Equipment) {
    const name = equipmentModified.name;
    const equipment_type = equipmentModified.equipment_type;
    const files = equipmentModified.files;
    const field = equipmentModified.fields;

    const userJson = JSON.stringify({name, equipment_type, files, field});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
                      .put<Equipment>(this.BASE_URL_API + '/api/maintenancemanagement/equipments/' + equipmentModified.id + '/',
                                  userJson,
                                  httpOptions);
  }

  /**
   * Fonction to update the name of an existing equipment in the database
   * @param equipmentNameModified the new name of the equipment
   * @param equipmentId the id of the equipment to modified
   */
  updateEquipmentName(equipmentNameModified: string, equipmentId: number) {
    const name = equipmentNameModified;

    const userJson = JSON.stringify({name});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
      .put<Equipment>(this.BASE_URL_API + '/api/maintenancemanagement/equipments/' + equipmentId + '/',
        userJson,
        httpOptions);
  }

  /**
   * Fonction to update the name of an existing equipment in the database
   * @param equipmentFileModified Array of id of files
   * @param equipmentId the id of the equipment to modified
   */
  updateEquipmentFile(equipmentFileModified: number[], equipmentId: number) {
    const files = equipmentFileModified;

    const userJson = JSON.stringify({files});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
      .put<Equipment>(this.BASE_URL_API + '/api/maintenancemanagement/equipments/' + equipmentId + '/',
        userJson,
        httpOptions);
  }

  /**
   * Fonction to save a new equipment in the database
   * @param name the formal name of the equipment
   * @param equipment_type number defining which type of equipment it is
   * @param files list of the id of the files concerning the equipment
   * @param field list of the fields of the equipment
   */
  createEquipment(name: string, equipment_type: number, files: number[], field: Field[]): Observable<any> {
    const equipmentJson = JSON.stringify({name, equipment_type, files, field});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
            .post(this.BASE_URL_API + '/api/maintenancemanagement/equipments/',
                  equipmentJson,
                  httpOptions);
  }

  /**
   * Function that delete an equipment saved on the server's database
   * @param equipmentId id attribut of the equipment you want to delete
   */
  deleteEquipment(equipmentId: number): Observable<any> {
    return this.httpClient.delete(this.BASE_URL_API + '/api/maintenancemanagement/equipments/' + equipmentId + '/');
  }

  /**
   * Function that delete a field of an equipment
   * @param equipmentId id of the equipment
   * @param fieldId id of the field to delete
   */
  deleteFieldEquipment(equipmentId: number, fieldId: number): Observable<any> {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        equipment_id: equipmentId,
        fieldobject_id: fieldId,
      },
    };

    return this.httpClient.delete(this.BASE_URL_API + '/api/maintenancemanagement/removefieldfromequipment/', httpOptions);
  }

}
