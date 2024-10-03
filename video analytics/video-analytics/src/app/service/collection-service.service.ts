import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class CollectionServiceService {
  isLoaderDismissed: boolean = false;
  date_format: string = 'dd-MMM yy';
  time_format: string = 'hh:mm';
  date_time_format: string = 'dd-MMM yy hh:mm a';
  default_limit: number = 100;
  URL = 'https://hmga440xsg.execute-api.us-east-1.amazonaws.com/dev';
  constructor(private loadingCtrl: LoadingController, private toastController: ToastController, private http: HttpClient,) { }


  storage = {
    get: async (key: string) => {
      return ((await Preferences.get({ key })) || {}).value;
    },
    set: async (key: string, value: string) => {
      return await Preferences.set({ key, value });
    },
    remove: async (key: string) => {
      return await Preferences.remove({ key });
    },
    clear: async () => {
      return await Preferences.clear();
    },
  }

  async showLoader() {
    this.isLoaderDismissed = false;
    const loader = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'lines-sharp',
      cssClass: 'ion-loading-class',
      translucent: true
    });

    if (!this.isLoaderDismissed && !(await this.loadingCtrl.getTop())) {
      await loader.present();
    }
  }

  async hideLoader() {
    try {
      this.isLoaderDismissed = true;
      if (await this.loadingCtrl.getTop()) {
        await this.loadingCtrl.dismiss();
      }
    } catch (e) {
      console.log(e);
    }
  }

  toster = {
    success: (message: string) => {
      this.toster.show('SUCCESS', message);
    },
    error: (message: any) => {
      this.toster.show('ERROR', message);
    },
    show: async (type: string, message: any) => {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        icon: type == 'SUCCESS' ? 'checkmark-outline' : 'close-outline',
        cssClass: type == 'SUCCESS' ? 'toaster-style' : 'cancel-toaster-style',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  customPopoverOptions: any = {
    cssClass: 'popover-wide',
  };

  //  var utcTime = '2023-05-23T10:17:51.615Z';
  //  var timestamp = Date.parse(this.utcTime);

  getCollection() {
    return this.http.get(`${this.URL}/rekognition/collection/list`);
  }

  getVideoList() {
    return this.http.get(`${this.URL}/rekognition/video/list`);
  }

  getJobDetailsById(id: any) {
    return this.http.get(`${this.URL}/rekognition/video/getResultByJobId/${id}`);
  }

  createCollection(data: any) {
    return this.http.post<any>(`${this.URL}/rekognition/collection/create`, { "collectionId": data });
  }

  addFaceCollection(id: any, data: any, value: any) {
    return this.http.post<any>(`${this.URL}/rekognition/collection/${id}/add-face`, { "externalImageId": value, "base64": data });
  }

  deleteCollection(data: any) {
    const payload = { body: { "collectionId": data } };
    return this.http.delete<any>(`${this.URL}/rekognition/collection/delete`, payload);
  }

  deleteFaceCollection(id: any, data: any) {
    const payload = { body: { "faceIds": data } };
    return this.http.delete<any>(`${this.URL}/rekognition/collection/${id}/delete-face`, payload);
  }

  faceListCollection(id: any,) {
    return this.http.get<any>(`${this.URL}/rekognition/collection/${id}/list-face`);
  }

  uploadVideo(data: any) {
    return this.http.post<any>(`${this.URL}/rekognition/video/upload`, data);
  }

  analyzeVideo(data: any, value: any) {
    return this.http.post<any>(`${this.URL}/rekognition/video/analyze`, { "collectionId": data, "fileName": value });
  }




}
