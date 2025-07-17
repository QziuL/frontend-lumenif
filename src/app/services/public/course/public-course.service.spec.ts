import { TestBed } from '@angular/core/testing';

import { PublicCourseService } from './public-course.service';

describe('PublicCourseService', () => {
  let service: PublicCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
