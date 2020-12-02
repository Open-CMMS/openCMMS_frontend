import { Pipe, PipeTransform} from '@angular/core';
@Pipe({ name: 'appFilter'})
export class FilterPipe implements PipeTransform {

  constructor() { }

  transform(items: any[], searchText: string): any[] {
    searchText = searchText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    if (searchText[0] === '@') {
      const searchTextWithout = searchText.substring(1);
      let all_teams = '';
      return items.filter( it => {
        all_teams = '';
        it.teams.forEach( team => {
          all_teams = all_teams.concat(team.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase() + ' ');
        });
        return all_teams.includes(searchTextWithout);
      });
    } else {
      return items.filter( it => {
        return it.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().includes(searchText);
      });
    }
  }
}
