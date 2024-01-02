import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from '../blog/components/blog-list/blog-list.component';

const routes: Routes = [
  { path: 'home', component: BlogListComponent },
  { path: 'personal_website', component: BlogListComponent, data: { category: 'Personal Website' } },
  { path: 'test_category', component: BlogListComponent, data: { category: 'Test category' } },
  { path: 'about', component: BlogListComponent },
  { path: 'contact', component: BlogListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
