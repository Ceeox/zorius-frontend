import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MediaService } from '../media/media.service';
import { Subscription } from 'rxjs';

export const LS_KEY_NAME = 'theme';

export enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitchService implements OnDestroy {
  private static readonly LIGHT_THEME_CLASS = 'light-theme';
  private static readonly DARK_THEME_CLASS = 'dark-theme';
  mediaService = new MediaService('(prefers-color-scheme: dark)');

  mediaSub$?: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.theme = this.theme;
    this.mediaSub$ = this.mediaService.match$.subscribe((isDark) => {
      if (isDark) {
        this.setDark();
      } else {
        this.setLight();
      }
    });
  }

  ngOnDestroy(): void {
    this.mediaSub$?.unsubscribe();
  }

  public get theme(): Theme {
    return Theme[localStorage.getItem(LS_KEY_NAME)] || Theme.System;
  }

  public set theme(v: Theme) {
    if (v === Theme.Light) {
      this.setLight();
    } else if (v === Theme.Dark) {
      this.setDark();
    } else {
      if (this.prefersLight()) {
        this.setLight();
      } else {
        this.setDark();
      }
    }

    localStorage.setItem(LS_KEY_NAME, v);
  }

  private setLight() {
    if (
      this.document.documentElement.classList.contains(
        ThemeSwitchService.LIGHT_THEME_CLASS
      )
    )
      return;

    this.document.documentElement.classList.remove(
      ThemeSwitchService.DARK_THEME_CLASS
    );
    this.document.documentElement.classList.add(
      ThemeSwitchService.LIGHT_THEME_CLASS
    );
  }

  private setDark() {
    if (
      this.document.documentElement.classList.contains(
        ThemeSwitchService.DARK_THEME_CLASS
      )
    )
      return;

    this.document.documentElement.classList.remove(
      ThemeSwitchService.LIGHT_THEME_CLASS
    );
    this.document.documentElement.classList.add(
      ThemeSwitchService.DARK_THEME_CLASS
    );
  }

  public prefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  public prefersLight(): boolean {
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }
}
