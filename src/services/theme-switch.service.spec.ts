/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThemeSwitchService } from './theme-switch.service';

describe('Service: ThemeSwitch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [ThemeSwitchService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject(
    [ThemeSwitchService],
    (service: ThemeSwitchService) => {
      expect(service).toBeTruthy();
    }
  ));
});
