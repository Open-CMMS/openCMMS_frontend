import { Injectable } from '@angular/core';
import { EquipmentType } from 'src/app/models/equipment-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentTypeService {

  private BASE_URL_API = environment.baseUrl;

  equipment_types: EquipmentType[] = [];
  equipment_types_subject = new Subject<EquipmentType[]>();

  constructor(private httpClient: HttpClient) {
    this.getEquipmentTypes();
  }

  /**
   * Function that updates the subject EquipmentTypeSubject
   */
  emitEquipmentTypes() {
    this.equipment_types_subject.next(this.equipment_types);
  }

  /**
   * Function that saves a new equipment type in the EquipmentType database
   * @param newEquipmentType the new equipmentType to be created
   */
  createEquipmentType(newEquipmentType: EquipmentType): Observable<any> {
    const ttJson = JSON.stringify(newEquipmentType);
    console.log(ttJson);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<EquipmentType>(this.BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/', ttJson, httpOptions);
  }

  /**
   * Function that modifies an equipment type in the EquipmentType database
   * @param updated_equipment_type the new EquipmentType to be updated
   */
  updateEquipmentType(updated_equipment_type: EquipmentType): Observable<any> {
    const ttJson = JSON.stringify(updated_equipment_type);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.put<EquipmentType>(this.BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/'
    + updated_equipment_type.id + '/',
                                              ttJson,
                                              httpOptions);
  }

  /**
   * Function that returns an equipment type in the EquipmentType database
   * @param equipment_type_id the id of the EquipmentType to be returned
   */
  getEquipmentType(equipment_type_id: number): Observable<EquipmentType> {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/' + equipment_type_id + '/');
  }

  /**
   * Function that returns all an equipment types in the EquipmentType database
   */
  getEquipmentTypes() {
    this.httpClient
      .get<any[]>(this.BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/')
      .subscribe(
        (response) => {
          this.equipment_types = [];
          response.forEach(element => {
            const gt = new EquipmentType(element.id, element.name,[]);
            this.equipment_types.push(gt);
          });
          this.emitEquipmentTypes();
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
  }

  /**
   * Function that deletes an equipment type in the EquipmentType database
   * @param id_equipment_type the if of the EquipmentType to be deleted
   */
  deleteEquipmentType(id_equipment_type: number) {
    this.httpClient
      .delete<any>(this.BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/' + id_equipment_type + '/')
      .subscribe(
        (response) => {
          const old_equipment_type = this.equipment_types.find((value) => {
            return value.id === id_equipment_type;
          });
          const index = this.equipment_types.indexOf(old_equipment_type);
          this.equipment_types.splice(index, 1);
          this.emitEquipmentTypes();
          return true;
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
    return false;
  }
}
