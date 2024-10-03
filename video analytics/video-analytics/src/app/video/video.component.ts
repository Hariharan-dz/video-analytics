import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { CollectionServiceService } from '../service/collection-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  // selectedFiles: File[] = [];
  // videoUrl: any;
  showAnalyzeViewModel = false;
  uploadView = false;
  imageDetails: any;
  view_Video = false;
  showVideoDetailsModel = false
  videoUrl: any;
  timingByID = false;
  jobId: string = '';
  videoName: any;
  collectionData: any = {};
  analyzeResult: any;
  selectPerson = -1;
  selectedFaceObj: any;
  ls: any;

  selectedFiles: {
    url: any;
    name: any;
    startTime: any;
    endTime: any
  }[] = [];

  URL = 'https://web3rekognition.s3.amazonaws.com/';

  video: any = {
    name: "videoDetails",
    pk: "Key",
    search: "",
    needServerSidePagination: false,
    isPageNationDisable: true,
    fields: [
      { name: "VIDEO NAME", attr: "Key", width: "135", type: "CLICK", clickFunction: (el: any) => this.viewVideo(el) },
      { name: "SIZE", attr: "Size", width: "175" },
      { name: "CREATED AT", attr: "LastModified", width: "175" },
    ],
    actions: [
      { name: "Analyze", clickFunction: (el: any) => this.analyzeOpen(el) },
    ],
    getRecord: (params: any) => this.colectnService.getVideoList(),
    buildData: (videoDetails: any) => {
      return videoDetails.map((order: any) => {
        return {
          Key: order.Key,
          Size: order.Size,
          LastModified: this.datePipe.transform(order.LastModified, this.colectnService.date_time_format),
          action: {
            // edit: '/configuration/template/' + order.id,
            // clone: '/configuration/template/clone/' + order.id,
          },
          // additionalData: {
          //   category_id: order.id
          // }
        };
      });
    }
  };

  video_details: any = {
    name: "video_details",
    pk: "Timestamp",
    search: "",
    needServerSidePagination: false,
    isPageNationDisable: true,
    fields: [
      { name: "TIME STAMP", attr: "Timestamp", width: "135", type: "CLICK", clickFunction: (el: any) => this.playVideo(this.selectedFiles, el) },
      // type: "CLICK", clickFunction: (el: any) => this.viewVideo(el)
      { name: "PERSON COUNT", attr: "person_count", width: "175" },
      { name: "FACE MATCH COUNT", attr: "face_match_count", width: "175", type: "CLICK", clickFunction: (el: any) => this.personDetailsBytiming(el) },
    ],
    // actions: [
    //   { name: "Analyze", clickFunction: (el: any) => this.analyzeOpen(el) },
    // ],
    // this.analyzeResult,//
    getRecord: (params: any) => this.colectnService.getJobDetailsById(this.jobId),
    buildData: (videoDetails: any) => {
      return videoDetails.map((order: any) => {
        return {
          time_stamp: order.time_stamp,
          person_count: order.person_count == '0' ? '0' : order.person_count,
          face_match_count: order.face_match_count == '0' ? '0' : order.face_match_count,

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

  person_details: any = {
    name: "person_details",
    pk: "face_id",
    search: "",
    needServerSidePagination: false,
    isPageNationDisable: true,
    fields: [
      { name: "FACE ID", attr: "face_id", width: "135" },
      // type: "CLICK", clickFunction: (el: any) => this.viewVideo(el)
      { name: "EXTERNAL IMAGE ID", attr: "External_img_id", width: "175" },
      { name: "TIMINGS", attr: "timings", width: "175", type: "CLICK", clickFunction: (el: any) => this.playVideo(this.selectedFiles, el) },
    ],
    actions: [
      // { name: "Analyze", clickFunction: (el: any) => this.analyzeOpen(el) },
    ],
    getRecord: (params: any) => this.colectnService.getJobDetailsById(this.jobId),
    buildData: (personDetails: any) => {
      return personDetails.map((order: any) => {
        return {
          face_id: order.face_id,
          External_img_id: order.External_img_id,
          timings: this.datePipe.transform(order.timings, this.colectnService.time_format),

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

  @ViewChild('video_collection') video_collection: DataTableComponent | undefined;
  @ViewChild('video_details') videoDetails: DataTableComponent | undefined;
  @ViewChild('person_details') personDetails: DataTableComponent | undefined;


  @ViewChild('videocontrols') videoPlayer: any;
  startTime: any;

  constructor(public colectnService: CollectionServiceService, public datePipe: DatePipe) {
    this.ls = localStorage;
  }

  ngOnInit() {

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.videoUrl = e.target.result;
      const videoName = file.name; // Extract the video name
      this.selectedFiles.push({ url: this.videoUrl, name: videoName, startTime: 0, endTime: 0 });
      console.log(this.selectedFiles);
    };
    reader.readAsDataURL(file);
  }

  playVideo(file: any, data: any) {
    if (data.timeStamp) {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = data.time_stamp;
      video.play();
      setTimeout(() => {
        video.pause();
      }, (file.endTime - file.startTime) * 1000);
    }
  }

  onCancel() {
    // this.selectedFiles = [];
    this.uploadView = false;
    this.showAnalyzeViewModel = false;
    this.view_Video = false;
    this.showVideoDetailsModel = false
  }
  async analyzeOpen(data: any) {
    try {
      this.jobId = "";
      await this.colectnService.showLoader();
      this.videoName = data.Key;
      this.imageDetails = await this.colectnService.getCollection().toPromise();
      this.showAnalyzeViewModel = true;
    } catch (err: any) {
      this.colectnService.toster.error(err.message || 'Analyze Failed');
    }
    this.colectnService.hideLoader();
  }

  viewVideo(el: any) {
    this.view_Video = true;
    this.videoName = el.Key;
  }

  personDetailsBytiming(data: any) {
    this.timingByID = true;
  }

  onReset(value: any) {
    this.timingByID = value;
    this.video.currentTime = 0;
  }

  uploadVideo() {

  }

  async analyzeVideo() {
    try {
      await this.colectnService.showLoader();
      this.jobId = (await this.colectnService.analyzeVideo(this.collectionData.id, this.videoName).toPromise()).JobId;
      console.log(this.jobId)
      while (true) {
        try {
          this.analyzeResult = await this.colectnService.getJobDetailsById(this.jobId).toPromise();
          this.analyzeResult.forEach((obj: any) => {
            obj.timings.forEach((obj1: any) => {
              const totalSeconds = Math.floor(obj1.timestamp / 1000);
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = totalSeconds % 60;
              obj1._timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            })
          });
          console.log(this.analyzeResult);
          this.showAnalyzeViewModel = false;
          this.showVideoDetailsModel = true;
          break;
        } catch (err: any) {
          var error = (err.error || err);
          if (error.errCode == "ERR-1001") {
            await this.pauseExecution(10000);
          } else throw err;
        }
      }
    } catch (err: any) {
      err = err.error || err;
      this.showAnalyzeViewModel = false;
      this.colectnService.toster.error(err.message || 'Analyze Failed');
    }
    this.colectnService.hideLoader();
  }

  async pauseExecution(timeInMS: number) {
    return new Promise(async (resolve: any, reject: any) => {
      setTimeout(() => resolve(), timeInMS);
    });
  }

  checkedPerson(res: any, index: number) {
    this.selectPerson = index;
    this.selectedFaceObj = res;
  }
  videoCurrentTime(res: any) {
    const [minutes, seconds] = res.split(":").map(Number);
    res = minutes * 60 + seconds;
    const video = this.videoPlayer.nativeElement;
    video.currentTime = res;
    video.play();
    this.startTime = res;
    video.pause();
    setTimeout(() => {
      video.pause();
    }, (video.duration - this.startTime) * 1000);
  }
}

  // videoCurrentTime(res: number) {
  //   const video = this.videoPlayer.nativeElement;
  //   if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
  //     video.currentTime = res;
  //     video.play();
  //     console.log('Start Time:', res);
  //   } else {
  //     console.error('Invalid start time:', res);
  //   }
  // }

