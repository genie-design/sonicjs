import { Component, OnInit, Input } from "@angular/core";
import { QuestionBase } from "../../../../projects/sonic-core/src/lib/models/question-base";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../projects/sonic-core/src/lib/services/question-control.service";
import { ContentTypesService } from "../../../../projects/sonic-core/src/lib/services/content-types.service";
import { ContentService } from "../../../../projects/sonic-core/src/lib/services/content.service";

import { UiService } from "../../../../projects/sonic-core/src/lib/services/ui.service";
import { FormService } from "../../../../projects/sonic-core/src/lib/services/form.service";

@Component({
  selector: "app-forms",
  templateUrl: "./forms.component.html",
  styleUrls: ["./forms.component.css"],
  providers: [QuestionControlService]
})
export class FormsComponent implements OnInit {
  @Input()
  questions: QuestionBase<any>[] = [];
  @Input()
  onSubmitHandler: any;
  @Input()
  onCancelHandler: any;
  @Input()
  id: any;

  form: FormGroup;
  payLoad : any;

  constructor(
    private qcs: QuestionControlService,
    private contentTypesService: ContentTypesService,
    private contentService:ContentService,
    private uiService: UiService,
    private formService:FormService
  ) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    //this.payLoad = JSON.stringify(this.form.value);
    this.payLoad = this.form.value;

    if(this.formService.layout){
      this.payLoad.layout = this.formService.layout;
    }

    console.log('onSubmit:payload', this.payLoad);
    //delagate back to the calling component
    this.onSubmitHandler(this.payLoad);

    this.uiService.showAside = false;
    // this.contentTypesService.contentInstance = JSON.stringify(this.form.value);
    // this.contentTypesService.createContentTypeInstanceSubmitSubject.next(
    //   JSON.stringify(this.form.value)
    // );
  }

  onCancel(){
    console.log('cancel form');
    this.onCancelHandler(this.payLoad);
  }
}