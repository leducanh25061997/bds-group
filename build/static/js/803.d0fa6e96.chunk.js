"use strict";(self.webpackChunkctlotus_valuation=self.webpackChunkctlotus_valuation||[]).push([[803],{12803:function(e,t,n){n.r(t),n.d(t,{ComisstionPolicy:function(){return L}});var i=n(19860),a=n(10437),l=n(61113),o=n(25645),s=n(14310),c=n(27314),r=n(47313),d=n(24511),u=n(97890),m=n(31538),h=n(68161),x=n(31421),g=n(26002),f=n(45987),p=n(1413),b=n(29439),v=n(70501),C=n(28485),Z=n(65280),j=n(30604),I=n(63501),S=n(64351),y=n(2220),k=n(81511),T=n(33222),w=n(52387),M=n(88476),N=n(95688),A=n(22871),E=n(93850),D=n(46417),R=["children","value","index"];function q(){var e=(0,E.XX)().actions,t=(0,u.s0)(),n=(0,i.Z)(),o=(0,S.kh)().actions,s=(0,d.$)(),x=s.t,q=(s.i18n,(0,T.I0)()),L=(0,T.v9)(A.W),P=L.ComisstionManagement,V=L.ComisstionManagementInactive,_=L.isLoading,H=(0,M.Z)(0),F=H.handleTabChange,O=H.activeTab,z=(0,r.useMemo)((function(){return{page:1,limit:20,checkStatus:!0}}),[]),B=(0,r.useState)(z),Q=(0,b.Z)(B,2),W=Q[0],U=Q[1],X=(0,r.useState)(""),$=(0,b.Z)(X,2),Y=$[0],G=($[1],(0,r.useState)(!1)),J=(0,b.Z)(G,2),K=J[0],ee=J[1],te=(0,r.useState)(w.qb.INACTIVE),ne=(0,b.Z)(te,2),ie=ne[0],ae=(ne[1],(0,r.useState)(0)),le=(0,b.Z)(ae,2),oe=le[0],se=(le[1],(0,r.useMemo)((function(){return[{id:"id",label:"M\xe3 ch\xednh s\xe1ch",align:"left",width:130},{id:"rule_name",label:"T\xean ch\xednh s\xe1ch",align:"left",width:140},{id:"date_create",label:"Ng\xe0y t\u1ea1o",width:110,align:"left"},{id:"date_start",label:"Ng\xe0y b\u1eaft \u0111\u1ea7u",width:130,align:"left"},{id:"date_end",label:"Ng\xe0y k\u1ebft th\xfac",width:130,align:"left"},{id:"project",label:"D\u1ef1 \xe1n",width:120,align:"left"},{id:"sales",label:"\u0110\u01a1n v\u1ecb b\xe1n h\xe0ng",width:200,align:"left"},{id:"status",label:"Tr\u1ea1ng th\xe1i",width:110,align:"left"},{id:"userUuid",label:"",width:70,align:"left"}]}),[x])),ce=(0,g.L0)({onFetchData:function(e){ue(e)},defaultFilter:z}),re=ce.filter,de=ce.onFilterToQueryString,ue=function(t){q(e.fetchListComisstion(t)),q(e.fetchListComisstionInactive(t))},me=function(e,t){de((0,p.Z)((0,p.Z)({},re),{},{sortByName:"true"===(null===re||void 0===re?void 0:re.sortByName)?"false":"true"}))},he=function(e){de((0,p.Z)((0,p.Z)({},re),{},{page:e}))},xe=function(e){de((0,p.Z)((0,p.Z)({},re),{},{page:1,limit:e}))},ge=function(e){var n;n=e.id,t("/comisstions/comisstions-policy/".concat(n))},fe=function(){ee(!1)},pe=function(e,t){var n;return[(0,D.jsx)(I.D,{text:"".concat(null===e||void 0===e?void 0:e.code),line:1,color:"#007AFF"}),(0,D.jsx)(I.D,{text:"".concat(null===e||void 0===e?void 0:e.name),line:1}),(0,D.jsx)(I.D,{text:"".concat((0,h.tg)(e.createdAt)),line:1}),(0,D.jsx)(I.D,{text:"".concat((0,h.tg)(e.startDate)),line:1}),(0,D.jsx)(I.D,{text:"".concat((0,h.tg)(e.endDate)),line:1}),(0,D.jsx)(I.D,{text:"".concat(null===e||void 0===e||null===(n=e.project)||void 0===n?void 0:n.name),line:1}),(0,D.jsx)(I.D,{text:"".concat(null===e||void 0===e?void 0:e.orgChartNames),line:2}),(0,D.jsx)(N.Z,{status:e.CheckStatus?w.qb.ACTIVE:w.qb.INACTIVE}),(0,D.jsx)("div",{children:(0,D.jsx)("img",{src:k.Z})})]},be=function(e){var t=e.children,n=e.value,i=e.index,o=(0,f.Z)(e,R);return(0,D.jsx)("div",(0,p.Z)((0,p.Z)({role:"tabpanel",hidden:n!==i,id:"simple-tabpanel-".concat(i),"aria-labelledby":"simple-tab-".concat(i)},o),{},{children:n===i&&(0,D.jsx)(a.Z,{sx:{p:3},children:(0,D.jsx)(l.Z,{children:t})})}))};(0,r.useMemo)((function(){return[{label:"\u0110\u1ee3t chi",options:[{label:"Ch\u1ecdn \u0111\u1ee3t chi",value:""},{label:"\u0110\u1ee3t 1",value:w.qb.APPRAISED},{label:"\u0110\u1ee3t 2",value:w.qb.ACTIVE},{label:"\u0110\u1ee3t 3",value:w.qb.INACTIVE}],handleSelected:function(e){U((0,p.Z)((0,p.Z)({},W),{},{status:e,fields:Y?["fullName","staffCode"]:[]}))}}]}),[W,Y]),(0,r.useMemo)((function(){return[{label:"D\u1ef1 \xe1n",options:[{label:"Ch\u1ecdn d\u1ef1 \xe1n",value:""},{label:"MetroStart",value:w.Qm.Staff},{label:"Deyas sky",value:w.Qm.Manager1}],handleSelected:function(e){U((0,p.Z)((0,p.Z)({},W),{},{staffType:e,fields:Y?["fullName","staffCode"]:[]}))}}]}),[W,Y]);return(0,D.jsxs)(v.Z,{sx:{width:"100%",overflow:"hidden"},children:[(0,D.jsxs)(C.Z,{value:O,onChange:F,sx:{"& .MuiTab-root.Mui-selected":{color:n.palette.common.black}},TabIndicatorProps:{style:{backgroundColor:m.Z.primary.button}},children:[(0,D.jsx)(Z.Z,{label:"CSHH hi\u1ec7n t\u1ea1i"}),(0,D.jsx)(Z.Z,{label:"CSHH v\xf4 hi\u1ec7u"})]}),(0,D.jsx)(be,{value:O,index:0,children:(0,D.jsx)(y.Z,{headers:se,onRequestSort:me,renderItem:pe,items:null===P||void 0===P?void 0:P.data,pageNumber:re.page,totalElements:null===P||void 0===P?void 0:P.total,sort:re.orderBy,limitElement:re.limit,onPageChange:he,onPageSizeChange:xe,isLoading:_,dataType:"Comisstionrules",onSelectRow:ge})}),(0,D.jsx)(be,{value:O,index:1,children:(0,D.jsx)(y.Z,{headers:se,onRequestSort:me,renderItem:pe,items:null===V||void 0===V?void 0:V.data,pageNumber:re.page,totalElements:null===V||void 0===V?void 0:V.total,sort:re.orderBy,limitElement:re.limit,onPageChange:he,onPageSizeChange:xe,isLoading:_,dataType:"Comisstionrules",onSelectRow:ge})}),K&&(0,D.jsx)(j.Z,{isOpen:K,handleClose:fe,handleSubmit:function(){var t={id:oe,status:ie};q(e.updateStatusComisstion(t,(function(t){null!==t&&void 0!==t&&t.success?(q(o.updateSnackbar({message:ie===w.qb.ACTIVE?x(c.I.common.unlockedAccount):x(c.I.common.lockedAccount),type:"success"})),q(e.fetchListComisstion(re)),fe()):q(o.updateSnackbar({message:x(c.I.common.errorOccurred),type:"error"}))})))},actionName:ie===w.qb.ACTIVE?x(c.I.common.unlock):x(c.I.common.lock),children:(0,D.jsx)(l.Z,{fontSize:"14px",fontWeight:700,color:n.palette.primary.light,mb:5,children:ie===w.qb.ACTIVE?x(c.I.confirmMessage.unlock):x(c.I.confirmMessage.lock)})})]})}function L(){var e=(0,i.Z)(),t=(0,d.$)().t,n=(0,u.s0)(),f=(0,g.Un)();return(0,D.jsxs)(r.Fragment,{children:[(0,D.jsx)(a.Z,{sx:{display:"flex",justifyContent:"end",paddingLeft:{xs:"12px",sm:"24px",lg:"0px"},paddingRight:{xs:"12px",sm:"24px",lg:"0px"}}}),(0,D.jsxs)(a.Z,{bgcolor:e.palette.grey[0],p:3,sx:{marginLeft:{xs:"12px",sm:"24px",lg:"0px"},marginRight:{xs:"12px",sm:"24px",lg:"0px"},borderRadius:3,mt:"-10px",minHeight:"calc(99%)"},children:[(0,D.jsxs)(a.Z,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",minHeight:"50px"},children:[(0,D.jsx)(l.Z,{fontSize:"20px",fontWeight:"700",color:m.Z.primary.text,children:t(c.I.sidebar.transRule)}),(0,D.jsx)(o.Z,{title:t(c.I.common.addNew),isIcon:!0,isHide:!(0,h.wI)(x.T.COMMISSION_POLICY_CREATE,f),buttonMode:"create",sxProps:{background:m.Z.primary.button,borderRadius:1,mb:"20px"},handleClick:function(){return n(s.Z.createComisstionRules)}})]}),(0,D.jsx)(q,{})]})]})}}}]);