/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;



  beforeEach(() => {
    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the hero image', () => {
    component.heroImagePath = 'path/to/image.jpg';
    fixture.detectChanges();
    const heroImage = fixture.debugElement.query(By.css('.hero-image'));
    expect(heroImage).toBeTruthy();
  });

  it('should display the hero image', () => {
    component.heroImagePath = 'path/to/image.jpg';
    fixture.detectChanges();
    const heroImage = fixture.debugElement.query(By.css('.hero-image'));
    expect(heroImage).toBeTruthy();
  });
});
