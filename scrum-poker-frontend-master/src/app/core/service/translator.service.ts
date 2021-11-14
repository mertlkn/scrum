import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
  })
export class TranslatorService {
    private lang! : string;
    constructor(private translate: TranslateService, private activatedRoute: ActivatedRoute) {
    translate.setDefaultLang(translate.getBrowserLang());

    this.activatedRoute.queryParams.subscribe(params => {
        this.lang=params.lang;
        if(this.lang==="en" || this.lang==="tr") {
        translate.use(this.lang);
        }
    })
    }
}