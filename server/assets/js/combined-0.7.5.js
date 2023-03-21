      data-template-region=${s} data-template-page=${a}>${o}</div>`}})(typeof exports==="undefined"?this["formattingService"]={}:exports);var verboseLogging=false;var isFrontEnd=true;if(typeof module!=="undefined"&&module.exports){isFrontEnd=false;var emitterService=require("./emitter.service");var globalService=require("./global.service");var pageBuilderService=require("./page-builder.service");var formService=require("./form.service");var helperService=require("./helper.service");var formattingService=require("./formatting.service");var _=require("underscore");var axios=require("axios");var fs=require("fs");var ShortcodeTree=require("shortcode-tree").ShortcodeTree;var chalk=require("chalk");var{GraphQLClient,gql,request}=require("graphql-request");const{User}=require("./typedefs/typedefs");verboseLogging=process.env.APP_LOGGING==="verbose";var log=console.log}else{const defaultOptions={headers:{},baseURL:globalService.baseUrl};let newAxiosInstance=axios.create(defaultOptions)}(function(e){var a="/graphql/";var t="";var n;var i;var r;e.startup=async function(){emitterService.on("requestBegin",async function(t){if(t){const e={headers:{},baseURL:globalService.baseUrl};if(t.req.signedCookies&&t.req.signedCookies.sonicjs_access_token){e.headers.Authorization=t.req.signedCookies.sonicjs_access_token}r=axios.create(e)}})},e.executeGraphqlQuery=async function(e){const t=`${globalService.baseUrl}/graphql`;const n=new GraphQLClient(t,{headers:{authorization:"Bearer MY_TOKEN"}});const i=n.request(e);return i},e.getAxios=function(){if(!r){const e={headers:{"Content-Type":"application/json"},withCredentials:true,baseURL:globalService.baseUrl,cookie:"sonicjs=s%3AMmvj7HC35YSG-RP1WEY6G3NS7mrSRFcN.EoldLokzB5IMX34xGLC2QwbU0HZn2dSFmtQ9BhPB26w"};let t=helperService.getCookie("sonicjs_access_token");if(t){e.headers.Authorization=t}r=axios.create(e);r.defaults.withCredentials=true}return r},e.userCreate=async function(e,t){};e.userUpdate=async function(e,t){let n=e.id;delete e.id;let i=JSON.stringify(e);let r=await this.getAxios().post(a,{query:`
        mutation{
          userUpdate( 
            id:"${n}", 
            profile:"""${i}""",
            sessionID:"${t}"){
              username
          }
        }
            `});return r.data},e.userDelete=async function(e,t){let n=`
      mutation{
        userDelete( 
          id:"${e}",
          sessionID:"${t}"){
            id
          }
      }
          `;let i=await this.getAxios().post(a,{query:n});return i.data.data.userDelete},e.rolesGet=async function(e){let t=await this.getAxios().post(a,{query:`
      {
        roles (sessionID:"${e}"){
          id
          data
        }
      }
        `});if(t.data.data.roles){return t.data.data.roles}},e.formGet=async function(e,t,n,i=false,r,c,o,s=false,a=[],l=false){let d=t?JSON.stringify(t):"";let h=a?JSON.stringify(a):"";const f=`
      {
        form (contentType: "${e}",
        content: """${d}""",
        defaults: """${h}""",
        onFormSubmitFunction: """${n}""",
        returnModuleSettings: ${i},
        formSettingsId: "${r??""}",
        showBuilder: ${s},
        referringUrl: "${o}",
        readOnly: ${l}){
          html
          contentType
        }
      }
        `;let u=await this.getAxios().post("/graphql",{query:f});if(u.data.data.form){return u.data.data.form}},e.getContent=async function(e){let t=await this.getAxios().post(a,{query:`
        {
          contents (sessionID:"${e}")
          {
            id
            contentTypeId
            data
            createdByUserId 
            createdOn
            lastUpdatedByUserId
            updatedOn
          }
        }
          `});if(t.data.data.contents){let e=t.data.data.contents;await formattingService.formatDates(e);await formattingService.formatTitles(e);return e}},e.getContentAdminCommon=async function(e){let t=await this.getContent(e);let n=_.sortBy(t,"updatedOn");let i=n.filter(e=>e.contentTypeId==="page"||e.contentTypeId==="blog");return i},e.getContentAdmin=async function(e){let t=await this.getContent(e);let n=_.sortBy(t,"updatedOn");return n},e.getContentByType=async function(e,t){let n=await this.getAxios().post(a,{query:`
        {
          contents (contentTypeId : "${e}", sessionID:"${t}") {
            id
            contentTypeId
            data
            createdOn
          }
        }
            `});return n.data.data.contents},e.getContentByTypeAndGroup=async function(e,t,n){let i=t?`, group : "${t}"`:"";let r=await this.getAxios().post(a,{query:`
        {
          contents (contentTypeId : "${e}" ${i}, sessionID:"${n}") {
            id
            contentTypeId
            data
            createdOn
          }
        }
            `});return r.data.data.contents},e.getPageTemplates=async function(e){let t=await this.getContentByType("page",e);let n=t.filter(e=>e.data.isPageTemplate);return n},e.contentTypeGet=async function(e,i){let r=await this.getAxios().post(a,{query:`
            {
                contentType(systemId:"${e}", sessionID:"${i.sessionID}") {
                  title
                  systemId
                  moduleSystemId
                  filePath
                  data
                  module
                }
              }
            `});if(!isFrontEnd){let e=await userService.getRoles(i.sessionID);await this.getPermissionsMatrix(r.data.data.contentType,e,i.sessionID);r.data.data.contentType.data=r.data.data.contentType.data??{};r.data.data.contentType.data.permissions=r.data.data.contentType.data?.permissions??[];r.data.data.contentType.data.permissions.map(e=>{e.roles.push("admin")});if(r.data.data.contentType.data.permissions.length){let e=await this.getContentByType("site-settings-acls",i.sessionID);let t=e[0].data.permissionAccessControls.map(e=>e.title);let n=i.user?.profile.roles;t.map(t=>{let e=r.data.data.contentType.data.permissions.find(e=>e.acl===t);if(e){r.data.data.contentType.acls=r.data.data.contentType.acls??{};r.data.data.contentType.acls[`can${helperService.capitalizeFirstLetter(t)}`]=_.intersection(e.roles,n).length!==0}})}}return r.data.data.contentType},e.getPermissionsMatrix=async function(i,e,t){let n=await this.getContentByType("site-settings-acls",t);let r=n[0].data.permissionAccessControls?.map(e=>e.title);i.permissionsMatrix={acls:r},i.permissionsMatrix.rows=e.map(n=>{let e=r.map(t=>{if(i.data?.permissions){let e=i.data.permissions.find(e=>e.acl===t);if(e?.roles.includes(n.key)||n.key==="admin"){return true}else{return false}}else{return false}});return{roleTitle:`${n.title} (${n.key})`,columns:e}})},e.contentTypesGet=async function(e){let t=await this.getAxios().post(a,{query:`
        {
          contentTypes (sessionID:"${e}") {
            title
            systemId
            moduleSystemId
            filePath
            data
          }
        }
          `});return t.data.data.contentTypes},e.queryfy=function(t){if(typeof t==="number"){return t}if(Array.isArray(t)){const e=t.map(e=>`${queryfy(e)}`).join(",");return`[${e}]`}if(typeof t==="object"){const e=Object.keys(t).map(e=>`${e}:${queryfy(t[e])}`).join(",");return`{${e}}`}return JSON.stringify(t)},e.contentTypeUpdate=async function(e,t){const n=e.data.components.filter(e=>e.properties===undefined||e.properties.fromCustomCode!==true);e.data.components=n;let i=JSON.stringify(e.data);let r=`
      mutation{
        contentTypeUpdate( 
          title:"${e.title}", 
          moduleSystemId:"${e.moduleSystemId}", 
          systemId:"${e.systemId}", 
          data:"""${i}""",
          sessionID:"${t}"){
            title
        }
      }
          `;let o=await this.getAxios().post(a,{query:r});return o.data.data.contentType},e.contentTypeDelete=async function(e,t){let n=JSON.stringify(e.data);let i=await this.getAxios().post(a,{query:`
        mutation{
          contentTypeDelete( 
            systemId:"${e}", sessionID:"${t}"){
              title
          }
        }
            `});return i.data.data.contentType},e.contentTypeCreate=async function(e,t){let n=`
      mutation{
        contentTypeCreate( 
          title:"${e.title}", 
          moduleSystemId:"${e.moduleSystemId}", 
          systemId:"${e.systemId}",
          sessionID:"${t}")
          {
            title
        }
      }
          `;let i=await this.getAxios().post(a,{query:n});return i.data.data.contentType},e.getContentTopOne=async function(e,t){let n=await this.getContentByType(e,t);if(n){return n[0]}else{throw new Error(`Could not find element getContentTopOne: ${e}, ${t}`)}},e.getContentByUrl=async function(e,t){let n=await this.getAxios().post(a,{query:`
            {
              content(url: "${e}", sessionID:"${t}") {
                id
                contentTypeId
                data
              }
            }
          `});if(n.data.data.content){return n.data.data.content}let i={data:{}};i.data.title="Not Found";i.data.body="Not Found";i.data.status="Not Found";i.url=e;return i},e.getContentByContentType=async function(e,t){let n=`
      {
        contents(contentTypeId: "${e}", sessionID:"${t}") {
          id
          contentTypeId
          data
          createdByUserId 
          lastUpdatedByUserId
          createdOn
          updatedOn
        }
      }
    `;let i=await this.getAxios().post(a,{query:n});if(i.data.data.contents){return i.data.data.contents}return"notFound"},e.getContentByContentTypeAndTitle=async function(e,t,n){let i=await this.getContentByContentType(e,n);if(i){let e=i.filter(e=>e.data.title.toLowerCase()===t.toLowerCase())[0];return e}},e.getContentByContentTypeAndTag=async function(e,t,n){let i=await this.getContentByContentType(e);if(i){let e=i.filter(e=>e.data.tags.includes(t.id));return e}},e.getContentByUrlAndContentType=async function(e,t,n){const i=`{"where":{"and":[{"url":"${t}"},{"data.contentType":"${e}"}]}}`;const r=encodeURI(i);let o=`${a}content?filter=${r}`;let s=await this.getAxios().get(o);if(s.data[0]){return s}return"not found"},e.editInstance=async function(e,t){let n=e.id;if(e.id){delete e.id}if(e.data&&e.data.id){n=e.data.id;delete e.data.id}let i=e.data;if(!i){i=e}let r=JSON.stringify(i);let o=`
      mutation{
        contentUpdate( 
          id:"${n}", 
          url:"${i.url}", 
          data:"""${r}""",
          sessionID:"${t}"){
            id
            url
            contentTypeId
        }
      }
          `;let s=await this.getAxios().post(a,{query:o});return s.data.data.contentUpdate},e.contentCreate=async function(e,t=true,n){if(e.data.contentType!=="page"&&e.data.contentType!=="blog"){if(t){e.data.url=helperService.generateSlugFromContent(e.data,true,true)}}let i=`
      mutation{
        contentCreate( 
          contentTypeId:"${e.data.contentType}", 
          url:"${e.data.url}", 
          data:"""${JSON.stringify(e.data)}""",
          sessionID:"${n}"){
            id
            url
            contentTypeId
        }
      }
          `;if(verboseLogging){console.log("contentCreate query ===>",i)}let r=await this.getAxios().post(a,{query:i});if(emitterService){emitterService.emit("contentCreated",r)}if(r.data.errors){console.error("contentCreate error ===>",JSON.stringify(r.data.errors))}if(verboseLogging){console.log("contentCreate result ===>",JSON.stringify(r.data))}return r.data.data.contentCreate};e.contentDelete=async function(e,t){let n=`
      mutation{
        contentDelete( 
          id:"${e}",
          sessionID:"${t}"){
            id
          }
      }
          `;let i=await this.getAxios().post(a,{query:n});return i};e.getContentById=async function(e,t){let n=await this.getAxios().post(a,{query:`
        {
          content(id: "${e}",
          sessionID:"${t}") {
            contentTypeId
            data
            id
            url
          }
        }
          `});if(n.data.data.content){n.data.data.content.data.id=n.data.data.content.id;n.data.data.content.data.contentType=n.data.data.content.contentTypeId;return n.data.data.content}},e.fileUpdate=async function(e,t,n){let i=await this.getAxios().post(a,{query:`
      mutation{
        fileUpdate( 
          filePath:"${e}", 
          fileContent:"""${t}""",
          sessionID:"${n}"
          )
          { 
            filePath 
          }
      }
          `});return i.data.data.fileUpdate},e.fileCreate=async function(e,t,n){let i=`
      mutation{
        fileCreate( 
          filePath:"${e}", 
          fileContent:"""${t}""",
          sessionID:"${n}"
          )
          { 
            filePath 
          }
      }
          `;let r=t.length;let o=await this.getAxios().post(a,{query:i});return o.data.data.fileUpdate},e.getView=async function(e,t,n,i){let r=await this.getAxios().post(a,{query:`
        {
          view(
            contentType:"${e}",
            viewModel: """${JSON.stringify(t)}""",
            viewPath:"${n}",
            sessionID:"${i}"
          ) {
          html
        }
      }
          `});if(r.data.data.view.html){return r.data.data.view.html}return notFound},e.asyncForEach=async function(t,n){for(let e=0;e<t.length;e++){await n(t[e],e,t)}},e.getImage=function(e){let t=this.getImageUrl(e);return`<img class="img-fluid rounded" src="${t}" />`},e.deleteModule=async function(e,t){let n=`
      mutation{
        moduleTypeDelete( 
          systemId:"${e}",
          sessionID:"${t}")
          { systemId }
      }
          `;let i=await this.getAxios().post(a,{query:n})},e.moduleCreate=async function(e,t){let n=await this.getAxios().post(a,{query:`
        mutation{
          moduleTypeCreate(
            title:"${e.data.title}", 
            enabled:${e.data.enabled}, 
            systemId:"${e.data.systemId}", 
            canBeAddedToColumn: ${e.data.canBeAddedToColumn},
            sessionID:"${t}"
            )
          {		
            title
            enabled
            systemId
            canBeAddedToColumn
          }
        }
          `});return n.data.data.fileUpdate},e.moduleEdit=async function(e,t){let n=await this.getAxios().post(a,{query:`
        mutation{
          moduleTypeUpdate(
            title:"${e.data.title}", 
            enabled:${e.data.enabled}, 
            systemId:"${e.data.systemId}", 
            icon:"${e.data.icon}", 
            canBeAddedToColumn: ${e.data.canBeAddedToColumn},
            singleInstance: ${e.data.singleInstance},
            version:"${e.data.version}"
            )
          {		
            title
            enabled
            systemId
            canBeAddedToColumn
          }
        }
          `});return n.data.data},e.mediaDelete=async function(e,t){let n=`
        mutation{
          mediaDelete( 
            id:"${e}",
            sessionID:"${t}"){
              id
            }
        }
            `;let i=await this.getAxios().post(a,{query:n});return i.data.data.mediaDelete};e.taxonomyGet=async function(t=null,n=null,i=null,e){taxonomies=await this.getContentByType("taxonomy");if(t){return taxonomies.find(e=>e.id===t)}else if(n){return taxonomies.find(e=>e.data.targetContentType===n)}else if(i){var r=_.filter(taxonomies,function(e){return _.some(e.data.terms,{urlRelative:i})});return r}else{return taxonomies}};e.getFiles=async function(){let e=[{title:"my image",filePath:"/images/test123.png"}];return e}})(typeof exports==="undefined"?this["dataService"]={}:exports);isBackEndMode=false;var axiosInstance;if(typeof module!=="undefined"&&module.exports){isBackEndMode=true;var dataService=require("./data.service");var emitterService=require("./emitter.service");var helperService=require("./helper.service");var globalService=require("./global.service");var multipart=require("connect-multiparty");var _=require("underscore");var appRoot=require("app-root-path");var fs=require("fs");var axios=require("axios");const ShortcodeTree=require("shortcode-tree").ShortcodeTree;const chalk=require("chalk");const log=console.log;const Formio={};const document={getElementById:{}}}else{}(function(_){_.startup=async function(e){emitterService.on("requestBegin",async function(t){if(t){const e={headers:{},baseURL:globalService.baseUrl};if(t.req.signedCookies&&t.req.signedCookies.sonicjs_access_token){e.headers.Authorization=t.req.signedCookies.sonicjs_access_token}axiosInstance=axios.create(e)}});emitterService.on("getRenderedPagePostDataFetch",async function(e){if(e&&e.page){e.page.data.editForm=await _.getForm(e.page.contentTypeId,null,"submitContent(submission)",undefined,undefined,e.req,e.req.url)}});e.get("/form",async function(e,t){t.send("form ok")});var t=require("connect-multiparty");e.use(t({uploadDir:`${appRoot.path}/server/temp`}));e.post("/video-upload",async function(e,t,n){let i=e.files.file.path;t.cookie("videoPath",i,{maxAge:9e5,httpOnly:true});t.send(i)})},_.getForm=async function(e,t,n,c=false,d,i,h,f=false,p,m=false){i.referringUrl=h;let r=t;if((typeof t==="string"||t instanceof String)&&t.length){r=JSON.parse(t)}let o;if(r&&r.data.contentType){o=await dataService.contentTypeGet(r.data.contentType.toLowerCase(),i)}else if(e){o=await dataService.contentTypeGet(e,i);if(d){o.data.components.unshift({type:"textfield",inputType:"text",key:"formSettingsId",defaultValue:d,hidden:false,input:true,customClass:"hide"})}if(c){const l=await dataService.contentTypeGet(`${e}-settings`,i);if(l&&l.title&&l.data){o=l}}}else{return}if(o&&emitterService){await emitterService.emit("formComponentsLoaded",{contentType:o,contentObject:r,req:i})}if(!n){n="editInstance(submission,true)"}``;const g=await _.getFormJson(o,r,f);if(p){const b=JSON.parse(p);for(const w of b){const C=Object.keys(w);const A=Object.values(w);const k=g.components.find(e=>e.key===C[0]);k.defaultValue=A}}let s="";let a={viewModel:{},viewPath:"/server/assets/html/form.html"};a.viewModel.onFormSubmitFunction=n;a.viewModel.editMode=false;let v={};if(r&&r.data){v=r.data;a.viewModel.editMode=true}if(o.data.states){if(a.viewModel.editMode&&o.data.states.editSubmitButtonText){const u=o.data.components.find(e=>e.key==="submit");if(u){u.label=o.data.states.editSubmitButtonText}}if(!a.viewModel.editMode&&o.data.states.addSubmitButtonText){const u=o.data.components.find(e=>e.key==="submit");if(u){u.label=o.data.states.addSubmitButtonText}}}a.viewModel.formJSON=JSON.stringify(g);a.viewModel.formValuesToLoad=JSON.stringify(v);a.viewModel.random=helperService.generateRandomString(8);a.viewModel.formioFunction=f?"builder":"createForm";a.viewModel.readOnly=m;a.viewPath="/server/assets/html/form.html";a.contentType="";let y=await dataService.getView("",a.viewModel,a.viewPath);if(y){s+=y}else{let e=await this.getFormTemplate();s+=e}return{html:s,contentType:o}},_.getFormJson=async function(e,t,n){let i=`${e.systemId}Form`;let r=await this.getFormSettings(e,t);let o=await this.getFormComponents(e,t,n);const s={components:o,name:i,settings:r};return s},_.getTemplate=async function(){let e=await this.getFormTemplate()},_.getFormTemplate=async function(){if(isBackEndMode){return this.getFormTemplateFileSystem()}else{let e=await globalService.axiosInstance.get("/html/form.html");return e.data}},_.getFormTemplateFileSystem=async function(){return new Promise((n,i)=>{let e="/server/assets/html/form.html";fs.readFile(e,"utf8",(e,t)=>{if(e){console.log(e);i(e)}else{n(t)}})})},_.getFormSettings=async function(e,t){let n={};if(isBackEndMode){n.recaptcha={isEnabled:"true",siteKey:process.env.RECAPTCHA_SITE_KEY}}return n},_.getFormComponents=async function(e,t,n){let i=e.data?.components;if(t){this.addBaseContentTypeFields(t.id,t.data.contentType,i)}else if(i&&!n){i.push({type:"hidden",key:"contentType",label:"contentType",defaultValue:e.systemId,hidden:false,input:true})}return i},_.addBaseContentTypeFields=function(e,t,n){if(n){n.push({type:"textfield",key:"id",label:"id",customClass:"hide",defaultValue:e,hidden:false,input:true})}};_.setFormApiUrls=async function(e){let t=sharedService.getBaseUrl();e.setProjectUrl(t);e.setBaseUrl(t)}})(typeof exports==="undefined"?this["formService"]={}:exports);$(document).ready(async function(){setupACEForSnippets()});async function setupACEForSnippets(){if(typeof ace==="undefined"){return}let r=$(".code-snippet");for(let i=0;i<r.length;i++){let e=r[i];let t=$(e);let n=t.data("type");var o=ace.edit(e);o.setTheme("ace/theme/chrome");o.session.setMode("ace/mode/"+n);o.renderer.setShowGutter(false);o.setOptions({maxLines:40,readOnly:true,highlightActiveLine:false,highlightGutterLine:false});o.renderer.$cursorLayer.element.style.display="none";o.autoIndent=true;o.setShowPrintMargin(false)}}$(document).ready(async function(){if($("[data-fancybox]").length){console.log("init fancybox");Fancybox.bind("[data-fancybox]",{})}});window.onscroll=function(){};var navbar=document.getElementById("accordian-menu");if(navbar){var sticky=navbar.getBoundingClientRect().top-90}function scrollCheck(){if(navbar){if(window.pageYOffset>=sticky){navbar.classList.add("sticky")}else{navbar.classList.remove("sticky")}}}var sessionID;var axiosInstance;$(document).ready(async function(){setupSessionID();await setupAxiosInstance()});async function setupAxiosInstance(){let e=window.location.protocol+"//"+window.location.host+"/";let t=$("#token").val();const n={headers:{Authorization:`${t}`},baseUrl:e};axiosInstance=axios.create(n)}function setupSessionID(){sessionID=$("#sessionID").val()}function fullPageUpdate(e=undefined){console.log("refreshing page url",e);if(e){window.location.replace(e)}else{location.reload()}}async function openFormInModal(e,t,n,i){await openDetailForm(e,n);await openEditForm(e,n);await openDeleteForm(e,n);await openCreateForm(e,t,i)}async function openDetailForm(n,i){if(n==="detail"){let e=await dataService.getContentById(i);let t=await dataService.formGet(e.contentTypeId,e,"await submitContent(submission);",undefined,undefined,$("#sessionID").val(),window.location.pathname,false,undefined,true);$("#genericModal .modal-title").text(helperService.titleCase(`${e.contentTypeId} ${n}`));$("#formio").empty();$("#formio").html(t.html);loadModuleSettingForm();$("#genericModal").appendTo("body").modal("show")}}async function openEditForm(n,i){if(n==="edit"){let e=await dataService.getContentById(i);let t=await dataService.formGet(e.contentTypeId,e,"await submitContent(submission);",undefined,undefined,$("#sessionID").val(),window.location.pathname);$("#genericModal .modal-title").text(helperService.titleCase(`${n} ${e.contentTypeId}`));$("#formio").empty();$("#formio").html(t.html);loadModuleSettingForm();$('input[name="data[title]"').focus();$("#genericModal").appendTo("body").modal("show")}}async function openDeleteForm(n,i){if(n==="delete"){let e=await dataService.getContentById(i);let t=JSON.stringify(e.data,null,4);t+=`<div><button class="mt-2 btn btn-danger" type="button"  onclick="return confirmDelete('${e.id}', 1)""><i class="bi bi-trash"></i> Confirm Delete</button></div>`;$("#genericModal .modal-title").text(helperService.titleCase(`${n} ${e.contentTypeId}`));$("#formio").empty();$("#formio").html(t);$("#genericModal").appendTo("body").modal("show")}}async function confirmDelete(e){dataService.contentDelete(e,$("#sessionID").val()).then(e=>{fullPageUpdate()})}async function openCreateForm(n,i,r){if(n==="create"){let e=await dataService.formGet(i,undefined,"await submitContent(submission);",undefined,undefined,$("#sessionID").val(),window.location.pathname,false,r&&r.defaults?r.defaults:[],false);let t=e.contentType.data.states?.moduleTitle??helperService.titleCase(`${n} ${i}`);$("#genericModal .modal-title").text(helperService.titleCase(`New ${i}`));$("#formio").empty();$("#formio").html(e.html);loadModuleSettingForm();$('input[name="data[title]"').focus();$("#genericModal").appendTo("body").modal("show")}}async function submitContent(submission,refresh=true,contentType="content",ignoreSuccessAction=false){console.log("Submission was made!",submission);let entity=submission.data?submission.data:submission;entity.contentType=entity.contentType??contentType;if(typeof formIsDirty!=="undefined"){formIsDirty=false}let result=await axios({method:"post",url:"/form-submission",data:{data:entity,url:window.location.pathname}});if(!ignoreSuccessAction){eval(result.data.successAction)}}async function editInstance(e,t,n="content",i){if(n==="user"){n="users"}await dataService.editInstance(e,sessionID).then(async function(e){console.log("editInstance --\x3e",e);removeDirty();if(e.contentTypeId==="page"&&!globalService.isBackEnd()){if(e.url){window.location.href=e.url}else{fullPageUpdate()}}else if(i){addGrowl(i)}else if(t){fullPageUpdate()}}).catch(function(e){console.log("editInstance",e)})}function removeDirty(){$(".submit-alert").remove();if(typeof formIsDirty!=="undefined"){formIsDirty=false}}async function createInstance(t,e=false,n="content"){console.log("payload",t);if(t.id||"id"in t){delete t.id}if(!t.data){let e={data:t};t=e}if(n==="Roles"){t=t.data}let i=await dataService.contentCreate(t);if(i&&i.contentTypeId==="page"){let e=globalService.isBackEnd();if(e){window.location.href=`/admin/content/edit/page/${i.id}`}else{window.location.href=t.data.url}}else if(e){fullPageUpdate()}return i}function postSubmissionSuccessMessage(e){let t=`<div>
  ${e}
  </div>
  <button class="btn btn-success mt-5" type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">Ok</span>
  </button>`;$("#formio").empty();$("#formio").html(t)}function redirectToUrl(e){window.location.href=e}function addGrowl(e){$.bootstrapGrowl(e,{ele:"body",type:"info",offset:{from:"bottom",amount:20},align:"right",width:250,delay:3e3,allow_dismiss:false,stackup_spacing:10})}