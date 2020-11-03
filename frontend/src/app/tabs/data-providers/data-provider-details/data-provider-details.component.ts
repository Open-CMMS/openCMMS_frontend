import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faSave } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-data-provider-details',
  templateUrl: './data-provider-details.component.html',
  styleUrls: ['./data-provider-details.component.scss']
})
export class DataProviderDetailsComponent implements OnInit {

  //Icons 
  faTrash = faTrash;
  faPen = faPen; 
  faSave = faSave;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

    /**
   * Function that is triggered to load the modal template for deletion
   * @param content the modal to open
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        // this.onDeleteTask();
        console.log("delete dataprovider")
      }
    },
    (error) => {});
  }

}
