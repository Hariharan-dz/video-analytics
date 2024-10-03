import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CollectionServiceService } from '../service/collection-service.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFiles: File[] = [];
  base64Content: any;

  isModalOpen = false;
  isViewOpen = false;
  isEditOpen = false;
  userDetails: any;
  delete_Image = false;
  collectionId: any;
  getCollection: any;
  fileName: any;
  ls: any;
  updateCollectionList: any;
  checkedImage: any;

  image: any = {
    name: "openorders",
    pk: "CollectionId",
    search: "",
    needServerSidePagination: false,
    isPageNationDisable: true,
    fields: [
      { name: "NAME", attr: "CollectionId", width: "135" },
      { name: "FACE COUNT", attr: "FaceCount", width: "175" },
      { name: "CREATED AT", attr: "CreationTimestamp", width: "175" },
    ],
    actions: [
      { name: "View", clickFunction: (el: any) => this.viewOpen(el, true) },
      { name: "Edit", clickFunction: (el: any) => this.editOpen(el, true) },
      { name: "Delete", clickFunction: (el: any) => this.deleteCOllection(el) },
    ],
    getRecord: (params: any) => this.colectnService.getCollection(),
    buildData: (openorders: any) => {
      return openorders.map((order: any) => {
        return {
          CollectionId: order.CollectionId,
          FaceCount: order.FaceCount == '0' ? '0' : order.FaceCount,
          // this.datePipe.transform(notification.createdAt, this.notifiService.date_time_format),
          CreationTimestamp: this.datePipe.transform(order.CreationTimestamp, this.colectnService.date_time_format),
          action: {
            // edit: '/configuration/template/' + order.id,
            // clone: '/configuration/template/clone/' + order.id,
          },
          additionalData: {
            category_id: order.id
          }
        };
      });
    }
  };

  @ViewChild('image_collection') userSegmentGrid: DataTableComponent | undefined;
  collectiontempID: any;
  faceId: any;
  constructor(private colectnService: CollectionServiceService, private modalCtrl: ModalController, public datePipe: DatePipe) {
    this.ls = localStorage;
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const base64Content = this.base64Content = e.target.result;
        this.selectedFiles.push(base64Content);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }
  editOpen(data: any, value: any) {
    this.isEditOpen = value;
    this.colectnService.showLoader();
    this.userDetails = data;
    this.collectiontempID = data.CollectionId;
    // this.deleteImageById(data)
    this.colectnService.faceListCollection(data.CollectionId).subscribe((data: any) => {
      this.colectnService.hideLoader();
      this.getCollection = data;
      console.log(this.getCollection)
    })
    console.log('adsfas', this.userDetails)
  }

  viewOpen(data: any, value: any) {
    this.isViewOpen = value;
    this.colectnService.showLoader();
    this.userDetails = data;
    this.colectnService.faceListCollection(data.CollectionId).subscribe((data: any) => {
      this.colectnService.hideLoader();
      this.getCollection = data;
      console.log(this.getCollection)
    })
  }

  reset() {
    this.delete_Image = false;
    this.selectedFiles = [];
    this.isEditOpen = false;
  }

  deleteImage(value: any) {
    const index = this.selectedFiles.indexOf(value);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }

  createCollection() {
    this.colectnService.showLoader();
    this.colectnService.createCollection(this.collectionId).subscribe({
      next: (data: any) => {
        this.colectnService.hideLoader();
        this.colectnService.toster.success("Collection Create Successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: (err: any) => {
        err = err.error || err;
        this.colectnService.hideLoader();
        this.colectnService.toster.error(err.message || 'Failed to Collection Create');
      }
    });
  }


  uploadImage() {
    // localStorage.setItem('CollectionId', this.userDetails.CollectionId);
    // const collectionName = localStorage.getItem('CollectionId');

    // localStorage.setItem('ExternalImageId', this.fileName);
    // const imageId = localStorage.getItem('ExternalImageId');

    // localStorage.setItem('base64', (this.selectedFiles[0]).toString());
    // const base64 = localStorage.getItem('base64');


    // const imageObject = {
    //   imageId: imageId || '',
    //   base64: base64 || '',
    // };
    // const collectionObject: { [key: string]: { imageId: string, base64: string }[] } = {};
    // if (collectionName !== null) {
    //   collectionObject[collectionName] = [imageObject];
    // }
    // const jsonStructure = JSON.stringify(collectionObject);
    // localStorage.setItem('images', jsonStructure);
    // const imagesDetails = localStorage.getItem('images');
    // console.log('adsefesfihas', imagesDetails)

    this.colectnService.showLoader();
    this.colectnService.addFaceCollection(this.collectiontempID, this.selectedFiles[0], this.fileName).subscribe({
      next: (data: any) => {
        this.colectnService.hideLoader();
        this.colectnService.toster.success('Upload Collection successfully!');
        this.isEditOpen = false;
        this.faceId = data.FaceRecords[0].Face.FaceId;
        data.FaceRecords.forEach((o: any) => {
          localStorage.setItem(o.Face.FaceId, this.base64Content);
        });
        console.log(this.faceId);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: async (err: any) => {
        this.colectnService.hideLoader();
        err = err.error || err;
        this.colectnService.toster.error(err.message || 'Upload Collection Failed');
      }
    });
  }

  deleteCOllection(data: any) {
    this.colectnService.showLoader();
    this.colectnService.deleteCollection(data.CollectionId).subscribe({
      next: (data: any) => {
        this.colectnService.hideLoader();
        this.colectnService.toster.success('Collection Delete successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: async (err: any) => {
        this.colectnService.hideLoader();
        err = err.error || err;
        this.colectnService.toster.error(err.message || 'Collection Delete Failed');
      }
    });
  }

  deleteImageById() {
    this.colectnService.showLoader();
    this.colectnService.deleteFaceCollection(this.collectiontempID, this.updateCollectionList).subscribe({
      next: (data: any) => {
        this.colectnService.hideLoader();
        this.colectnService.toster.success('Image Delete successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: async (err: any) => {
        this.colectnService.hideLoader();
        err = err.error || err;
        this.colectnService.toster.error(err.message || 'Image Delete Failed');
      }
    });
  }

  deleteCheckedImage(event: any, res: any) {
    let checkId = res.FaceId;
    if (event.detail.checked === true) {
      this.updateCollectionList = this.updateCollectionList || [];
      this.updateCollectionList.push(checkId);
    } else {
      if (this.updateCollectionList && this.updateCollectionList.includes(checkId)) {
        this.updateCollectionList = this.updateCollectionList.filter((id: any) => id !== checkId);
      }
    }
    console.log(this.updateCollectionList)
  }

  onCancel() {
    this.delete_Image = false;
    this.updateCollectionList = [];
  }

};

