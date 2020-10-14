import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform, ɵALLOW_MULTIPLE_PLATFORMS} from '@angular/core';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';
@Pipe({ name: 'appFilter'})
export class FilterPipe implements PipeTransform {

  constructor(private httpClient: HttpClient,
              private teamService: TeamService ) { }

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    if (searchText[0]=="@") {
      let searchTextWithout = searchText.substring(1);
      let all_teams = ''
      return items.filter( it => {
        all_teams = ''
        it.teams.forEach( team => {
          all_teams = all_teams.concat(team.name.toLocaleLowerCase()+' ')
        });
        console.log(searchTextWithout)
        console.log(all_teams)
        return all_teams.includes(searchTextWithout)
      })
    } else {
      return items.filter( it => {
        return it.name.toLocaleLowerCase().includes(searchText)
      })
    }
      //   let all_teams = []
      //   return items.filter(it => {
      //     all_teams = []
      //     it.teams.forEach(team => {
      //       all_teams.push(team.name.toLocaleLowerCase())
      //     });
      //     return it.name.toLocaleLowerCase().includes(searchText) || all_teams.includes(searchText);
      //   })
      // )
  }
}
