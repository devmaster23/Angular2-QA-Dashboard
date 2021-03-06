import { Component, OnInit, ElementRef } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Http, Headers, Response, RequestOptions  } from '@angular/http';
import { Observable  } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  plan_type: string = null;
  adminSetting: object = {};
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        let t_plan_type = localStorage.getItem('member_type');
        this.plan_type = params['plan_type'] || t_plan_type || 'Onedone';
      });
    this.getSetting();
  }
  getSetting(){
    this.dataService.getAdminSetting().subscribe(
      response => {
        for(let item of response.result)
        {
            this.adminSetting[item['DataType']] = item['Data'].toString().replace(/(.)(?=(.{3})+$)/g,"$1,")
        }
      },
      (error) => {

      }
    );
  }

  continue(member_type)
  {
    let data = {
      member_type: member_type
    }
    this.dataService.updateUserMembership(data).subscribe(
      response => {
        let error_code = response.ERR_CODE;
        if(error_code == 'ERR_NONE')
        {
          localStorage.setItem('member_type', member_type);
          let isInvite = localStorage.getItem('isInvite');
          if(isInvite == 'true')
            this.router.navigate(['/app']);
          else
            this.router.navigate(['/complete-profile']);
        }
      },
      (error) => {

      }
    );
  }

}
