import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const LS_THEME = 'theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitchService {
  private static readonly LIGHT_THEME_CLASS = 'light-theme';
  private static readonly LIGHT_THEME = 'light';

  private static readonly DARK_THEME_CLASS = 'dark-theme';
  private static readonly DARK_THEME = 'dark';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  public currentTheme(): string {
    let theme = localStorage.getItem(LS_THEME);
    if (!theme) {
      if (this.prefersColorSchemeDark())
        return ThemeSwitchService.DARK_THEME;
      else
        return ThemeSwitchService.LIGHT_THEME;
    }
    return theme
  }

  public prefersColorSchemeDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  public selectDarkTheme(): void {
    if (this.document.documentElement.classList.contains(ThemeSwitchService.DARK_THEME_CLASS))
      return;

    this.document.documentElement.classList.remove(ThemeSwitchService.LIGHT_THEME_CLASS);
    this.document.documentElement.classList.add(ThemeSwitchService.DARK_THEME_CLASS);

    localStorage.setItem(LS_THEME, ThemeSwitchService.DARK_THEME);
  }

  public selectLightTheme(): void {
    if (this.document.documentElement.classList.contains(ThemeSwitchService.LIGHT_THEME_CLASS))
      return;

    this.document.documentElement.classList.remove(ThemeSwitchService.DARK_THEME_CLASS);
    this.document.documentElement.classList.add(ThemeSwitchService.LIGHT_THEME_CLASS);

    localStorage.setItem(LS_THEME, ThemeSwitchService.LIGHT_THEME);
  }
}
