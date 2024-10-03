import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [
  {
    path: 'collection',
    component: CollectionComponent,
  },
  {
    path: 'video',
    component: VideoComponent,
  },

  {
    path: '',
    redirectTo: 'collection',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
