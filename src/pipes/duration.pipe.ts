import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(value: number) {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }
}
