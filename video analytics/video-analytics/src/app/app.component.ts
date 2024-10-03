import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isMenuCollapse = true;
  menuList = [
    {
      title: 'Collection',
      image: 'image-outline',
      link: 'collection',
    },
    {
      title: 'Video',
      image: 'film-outline',
      link: 'video',
    },
    // {
    //   title: 'Analyze',
    //   image: 'search-outline',
    //   link: 'analyze',
    // },
  ];
  constructor() { }
}
