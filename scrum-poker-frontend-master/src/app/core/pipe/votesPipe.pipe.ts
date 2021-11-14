import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'votesPipe'})
export class VotesPipe implements PipeTransform {
    transform(value: any): string {
        if(value === "-1" || value === -1) {
            return "?";
        } else if(value==="-2" || value === -2) {
            return "X";
        } else if(value==="-403"  || value === -403) {
            return "?";
        } else {
            return value.toString();
        }
    }
}