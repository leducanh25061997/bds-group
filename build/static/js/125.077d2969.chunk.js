"use strict";(self.webpackChunkctlotus_valuation=self.webpackChunkctlotus_valuation||[]).push([[125],{97125:function(e,t,n){n.r(t),n.d(t,{Orgchart:function(){return _}});var r=n(19860),o=n(10437),i=n(14310),a=n(47313),l=n(24511),c=n(97890),s=n(74165),d=n(15861),u=n(93433),p=n(1413),h=n(29439),x=n(47131),f=n(70501),g=n(61113),m=n(48310),b=n(45624),Z=n(63501),v=n(95688),y=n(64351),j=n(2220),k=n(26002),C=n(81511),w=n(27314),I=n(33222),S=n(29466),F=n(52387),D=n(10658),R=n.n(D),T=n(25645),O=n(65165),P=n(31538),A=n(75184),M=n(99349),E=n(32718),L=n(83294),N=n(4942),Y=n(17592),q=(0,Y.ZP)(o.Z)((function(e){var t,n=e.theme;return t={width:"340px",display:"inline-flex",backgroundColor:"".concat(n.palette.common.white," !important"),alignItems:"center",borderRadius:"8px",height:"41px"},(0,N.Z)(t,n.breakpoints.down("sm"),{width:"100%"}),(0,N.Z)(t,"input",{fontSize:"16px",paddingLeft:"16px",border:"none",height:"100%",width:"100%",outline:"none",background:"".concat(n.palette.secondary.lighter)}),t})),z=((0,Y.ZP)("img")((function(e){e.theme;return{width:"40px",height:"40px",paddingLeft:"16px"}})),n(66253)),V=n(46417);function U(e){var t=(0,r.Z)(),n=(0,l.$)().t,i=e.isFilter,c=e.onChangeSearchInput,s=e.filterList,d=e.submitFilter,u=((0,I.I0)(),(0,z.RF)().actions,(0,S.lr)()),p=(0,h.Z)(u,2),x=p[0],f=(p[1],(0,a.useState)((function(){var e;return null!==x&&void 0!==x&&x.get("query")?null===x||void 0===x||null===(e=x.get("query"))||void 0===e?void 0:e.replace("%2B","+"):""}))),m=(0,h.Z)(f,2),b=m[0],Z=m[1],v=(0,a.useRef)();return(0,V.jsxs)(o.Z,{sx:{display:"flex",flexDirection:{xs:"column",md:"row"},color:t.palette.secondary.contrastText,bgcolor:P.Z.primary.barList,borderRadius:"8px",mb:"15px",p:"20px 20px 8px 20px"},children:[(0,V.jsxs)(q,{className:"input",sx:{bgcolor:P.Z.common.white,"& input::placeholder":{color:"#AFAFAF"},border:"1px solid #D3D3D3",borderRadius:"8px",mr:"15px"},children:[(0,V.jsx)(g.Z,{sx:{fontSize:14,fontWeight:500,color:"#222222",background:t.palette.common.white,p:"0px 8px 0px 8px",mb:"45px",ml:"12px",position:"absolute"},children:"T\u1eeb kho\xe1 t\xecm ki\u1ebfm"}),(0,V.jsx)("input",{style:{borderRadius:"8px",backgroundColor:P.Z.common.white,fontSize:14,fontWeight:400,paddingRight:"15px"},type:"text",placeholder:"Nh\u1eadp t\u1eeb kho\xe1 t\xecm ki\u1ebfm",onChange:function(e){Z(e.target.value),v.current&&clearTimeout(v.current),v.current=setTimeout((function(){c(e.target.value.replaceAll("+","%2B"))}),500)},value:b})]}),(0,V.jsx)(o.Z,{sx:{display:"flex",gap:{xs:"12px",sm:"0px"},alignItems:"center"},children:null===s||void 0===s?void 0:s.map((function(e){return(0,V.jsx)(a.Fragment,{children:"date"!==e.type&&(0,V.jsx)(L.Z,{label:e.label,list:e.options,handleSelected:e.handleSelected})},e.label)}))}),i&&(0,V.jsx)(T.Z,{title:n(w.I.common.search),buttonMode:"filter",sxProps:{background:t.palette.common.white,color:P.Z.primary.button,border:"1px solid ".concat(P.Z.primary.button),borderRadius:"8px",":hover":{background:t.palette.common.white}},sxPropsText:{fontSize:"16px",fontWeight:400},handleClick:function(){null===d||void 0===d||d()}})]})}function W(){var e=(0,l.$)(),t=e.t,n=(e.i18n,(0,E.Cj)().actions),D=(0,y.kh)().actions,L=(0,E.Cj)().actions,N=(0,r.Z)(),Y=(0,I.v9)(M.p),q=Y.OrgchartManagement,z=Y.listOtherSector,W=Y.isLoading,_=((0,k.Un)(),(0,a.useMemo)((function(){return{page:1,limit:20}}),[])),B=(0,a.useRef)(null),$=(0,c.s0)(),H=(0,a.useRef)(null),K=(0,a.useState)(!1),Q=(0,h.Z)(K,2),G=Q[0],J=Q[1],X=(0,a.useState)(F.qb.INACTIVE),ee=(0,h.Z)(X,2),te=(ee[0],ee[1],(0,a.useState)(0)),ne=(0,h.Z)(te,2),re=(ne[0],ne[1],(0,a.useState)(_)),oe=(0,h.Z)(re,2),ie=oe[0],ae=oe[1],le=(0,a.useState)(""),ce=(0,h.Z)(le,2),se=ce[0],de=ce[1],ue=(0,k.L0)({onFetchData:function(e){fe()},defaultFilter:_}),pe=ue.filter,he=ue.onFilterToQueryString,xe=(0,I.I0)(),fe=function(){xe(n.fetchListOrgchart())};(0,a.useEffect)((function(){xe(L.fetchListSectorsType())}),[xe,L]);var ge=(0,a.useMemo)((function(){if(z){var e=[];return null===z||void 0===z||z.forEach((function(t){e.push({label:t.description||"",value:t.name||"",id:t.id.toString()})})),e}return[]}),[z]),me=(0,a.useMemo)((function(){return[{label:"\u0110\u01a1n v\u1ecb/ C\xf4ng ty",options:[{label:"Ch\u1ecdn \u0111\u01a1n v\u1ecb/ C\xf4ng ty",value:"",id:""}].concat((0,u.Z)(ge)),handleSelected:function(e){var t,n=null===(t=ge.find((function(t){return t.value===e})))||void 0===t?void 0:t.id;ae((0,p.Z)((0,p.Z)({},ie),{},{sector:n?n+"":null,fields:se?["otherProperty.name","otherProperty.code"]:[]}))}},{label:"Tr\u1ea1ng th\xe1i",options:[{label:"Ch\u1ecdn tr\u1ea1ng th\xe1i",value:""},{label:"K\xedch ho\u1ea1t",value:F.qb.ACTIVE},{label:"V\xf4 hi\u1ec7u",value:F.qb.INACTIVE}],handleSelected:function(e){ae((0,p.Z)((0,p.Z)({},ie),{},{status:e,fields:se?["otherProperty.name","otherProperty.code"]:[]}))}}]}),[ge,ie,se]),be=(0,a.useMemo)((function(){return[{id:"code",label:t(w.I.Orgchart.orgchartCode),align:"left",width:120},{id:"name",label:t(w.I.Orgchart.orgchartName),align:"left",width:180},{id:"manager",label:t(w.I.Orgchart.manager),width:180,align:"left"},{id:"count",label:t(w.I.Orgchart.emloyeeCount),width:150,align:"center",hasSort:!0},{id:"createDate",label:t(w.I.Orgchart.createDate),width:120,align:"left"},{id:"updatedate",label:t(w.I.Orgchart.updatedate),width:120,align:"left"},{id:"status",label:t(w.I.Orgchart.status),width:100,align:"left"},{id:"option",label:"",width:80,align:"left"}]}),[t]),Ze=function(){J(!0)},ve=function(){J(!1)},ye=function(){var e=(0,d.Z)((0,s.Z)().mark((function e(t){return(0,s.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.target.files){e.next=5;break}return e.next=3,O.Z.uploadFileOrgchart(t.target.files[0]);case 3:e.sent?(xe(D.updateSnackbar({message:"Upload file excel th\xe0nh c\xf4ng",type:"success"})),fe()):xe(D.updateSnackbar({message:"Upload file excel kh\xf4ng th\xe0nh c\xf4ng",type:"error"}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),je=function(e){$("/orgchart/edit/".concat(e))};return(0,V.jsxs)(f.Z,{sx:{width:"100%",overflow:"hidden"},children:[(0,V.jsxs)(o.Z,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mt:1,mb:2},children:[(0,V.jsx)(g.Z,{fontSize:"20px",fontWeight:"700",color:P.Z.primary.text,children:t(w.I.sidebar.orchartList)}),(0,V.jsxs)(o.Z,{sx:{display:"flex"},children:[(0,V.jsx)(T.Z,{title:"Upload file Excel",isIcon:!0,buttonMode:"excel",sxProps:{background:P.Z.primary.button,borderRadius:1},handleClick:function(){var e;null===(e=H.current)||void 0===e||e.click()}}),(0,V.jsx)("input",{type:"file",accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",ref:H,onChange:ye,style:{display:"none"}}),(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(T.Z,{title:"T\u1ea3i",isIcon:!0,propRef:B,buttonMode:"download",sxProps:{background:P.Z.primary.button,borderRadius:1,m:"0px 15px 20px 15px"},handleClick:Ze}),(0,V.jsx)(A.Z,{open:G,onClose:ve,anchorEl:B.current,sx:{width:"max-content"},children:(0,V.jsx)(m.Z,{children:(0,V.jsx)(b.Z,{sx:{":hover":{backgroundColor:"#FDEAF4"},m:"6px",borderRadius:"4px"},onClick:Ze,children:(0,V.jsx)(S.rU,{style:{color:"transparent"},to:"/static/template/Template_Orgchart.xlsx",download:"Template_Orgchart",target:"_blank",children:(0,V.jsx)(o.Z,{display:"flex",alignItems:"center",children:(0,V.jsx)(g.Z,{ml:1,fontSize:"14px",fontWeight:400,color:N.palette.common.black,children:"T\u1ea3i template"})})})})})})]}),(0,V.jsx)(T.Z,{title:t(w.I.common.addNew),isIcon:!0,buttonMode:"create",sxProps:{background:P.Z.primary.button,borderRadius:1},handleClick:function(){return $(i.Z.createOrgchart)}})]})]}),(0,V.jsx)(U,{onChangeSearchInput:function(e){de(e),he((0,p.Z)((0,p.Z)({},pe),{},{search:e,page:1,fields:e?["otherProperty.name","otherProperty.code"]:[]}))},placeholder:t(w.I.common.search),isFilter:!0,filterList:me,submitFilter:function(){he((0,p.Z)((0,p.Z)({},ie),{},{page:1,search:se}))}}),(0,V.jsx)(j.Z,{headers:be,renderItem:function(e,t){var n;return[(0,V.jsx)(Z.D,{text:"".concat(e.code),line:1,color:"#007AFF"}),(0,V.jsx)(Z.D,{text:"".concat(e.name),line:2}),(0,V.jsx)(Z.D,{text:"".concat(null===(n=e.manager)||void 0===n?void 0:n.fullName),line:2}),(0,V.jsx)(Z.D,{text:"".concat(e.countStaff),line:1}),(0,V.jsx)(Z.D,{text:"".concat(R()(e.createdAt).format("DD/MM/YYYY")),line:1}),(0,V.jsx)(Z.D,{text:"".concat(R()(e.updatedAt).format("DD/MM/YYYY")),line:1}),(0,V.jsx)(v.Z,{status:e.status?F.qb.ACTIVE:F.qb.INACTIVE}),(0,V.jsx)("div",{style:{display:"flex"},children:(0,V.jsx)(x.Z,{onClick:function(){return je(e.id)},children:(0,V.jsx)("img",{src:C.Z,alt:"icon edit"})})})]},onClickRow:function(e){je(e.id)},items:null===q||void 0===q?void 0:q.data,pageNumber:pe.page,totalElements:null===q||void 0===q?void 0:q.total,sort:pe.orderBy,limitElement:pe.limit,onPageChange:function(e){he((0,p.Z)((0,p.Z)({},pe),{},{page:e}))},onPageSizeChange:function(e){he((0,p.Z)((0,p.Z)({},pe),{},{page:1,take:e}))},isLoading:W})]})}function _(){var e=(0,r.Z)();(0,l.$)().t,(0,c.s0)();return(0,V.jsx)(a.Fragment,{children:(0,V.jsx)(o.Z,{bgcolor:e.palette.grey[0],p:3,sx:{marginLeft:{xs:"12px",sm:"24px",lg:"0px"},marginRight:{xs:"12px",sm:"24px",lg:"0px"},borderRadius:3,mt:"-10px",minHeight:"calc(99%)"},children:(0,V.jsx)(W,{})})})}}}]);