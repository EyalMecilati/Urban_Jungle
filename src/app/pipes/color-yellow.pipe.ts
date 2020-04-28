import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'colorYellow'
})

export class ColorYellowPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    };
    const re = new RegExp(args, 'gi');
    const match = value.match(re);
    if (!match) {
      return value;
    };

    const result = value.replace(re, `<span class='mark'>${match[0]}</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}


