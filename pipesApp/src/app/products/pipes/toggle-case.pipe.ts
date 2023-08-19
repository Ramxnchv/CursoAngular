import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toogleCase'
})

export class ToogleCasePipe implements PipeTransform {
    transform(value: string, toUpper: boolean = false): string {
        return (toUpper) ? value.toUpperCase() : value.toLowerCase();
    }
}