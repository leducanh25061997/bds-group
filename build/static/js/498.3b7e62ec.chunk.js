"use strict";(self.webpackChunkctlotus_valuation=self.webpackChunkctlotus_valuation||[]).push([[498],{29498:function(t,e,n){n.r(e),n.d(e,{OrgchartDetail:function(){return z}});var o=n(10437),s=n(47313),i=n(74165),r=n(15861),a=n(29439),c=n(35898),u=n(61113),d=n(19536),l=n(48119),p=n(19860),h=n(9019),x=n(25645),g=n(64351),f=n(37555),m=n(27314),y=n(43270),b=n(24511),Z=n(33222),j=n(97890),k=n(31538),w=n(9795),C=n(40403),S=n(90244),N=(n(31967),n(99349)),T=n(32718),v=n(46417),A=[{id:"1",type:"customeNodes",position:{x:0,y:0},data:{name:"C\xe1nh qu\xe2n 1",staff:"Nguy\u1ec5n Ti\u1ebfn Anh",position:"Gi\xe1m \u0111\u1ed1c d\u1ef1 \xe1n"}},{id:"2",type:"customeNodes",position:{x:-115,y:135},data:{name:"Tr\u01b0\u1edfng ph\xf2ng 1",staff:"Nguy\u1ec5n V\u0103n Nguy\xean",position:"Tr\u01b0\u1edfng ph\xf2ng"}},{id:"3",type:"customeNodes",position:{x:115,y:135},data:{name:"Tr\u01b0\u1eddng ph\xf2ng 2",staff:"Nguy\u1ec5n C\xf4ng Tr\xed D\u0169ng",position:"Tr\u01b0\u1edfng ph\xf2ng"}},{id:"4",type:"customeNodes",position:{x:-230,y:270},data:{name:"Tr\u01b0\u1edfng nh\xf3m 1",staff:"Nguy\u1ec5n V\u0103n Nguy\xean",position:"Tr\u01b0\u1edfng nh\xf3m"}},{id:"5",type:"customeNodes",position:{x:0,y:275},data:{name:"Tr\u01b0\u1edfng nh\xf3m 2",staff:"Nguy\u1ec5n V\u0103n A",position:"Tr\u01b0\u1edfng nh\xf3m"}}],H=[{id:"e1-2",source:"1",target:"2",type:"step",sourceHandle:"a",style:{stroke:k.Z.primary.button}},{id:"e1-3",source:"1",target:"3",sourceHandle:"b",type:"step",style:{stroke:k.Z.primary.button}},{id:"e2-4",source:"2",target:"4",sourceHandle:"b",type:"step",style:{stroke:k.Z.primary.button}},{id:"e2-5",source:"2",target:"5",sourceHandle:"b",type:"step",style:{stroke:k.Z.primary.button}}],E={customeNodes:function(t,e){(0,s.useCallback)((function(t){console.log(t.target.value)}),[]);return(0,v.jsxs)(c.Z,{sx:{border:"1px solid #EB94A3",borderRadius:"8px",width:{md:"187px"},height:{md:"85px"},p:"5px"},children:[(0,v.jsx)(w.HH,{type:"target",position:w.Ly.Top,isConnectable:e,style:{background:"#D6465F",width:"10px",height:"10px"}}),(0,v.jsx)(u.Z,{fontWeight:700,fontSize:"14px",color:k.Z.primary.button,textAlign:"center",children:t.data.name}),(0,v.jsx)(d.Z,{sx:{background:k.Z.primary.button,width:"90%",my:1,mx:"5%"}}),(0,v.jsxs)(c.Z,{sx:{flexDirection:"row",alignItems:"center",ml:1},children:[(0,v.jsx)(l.Z,{sx:{width:28,height:28},src:"https://i.ibb.co/f9M2bwg/278238193-3052363221682674-5550266724405196590-n.jpg"}),(0,v.jsxs)(c.Z,{sx:{alignItems:"flex-start",ml:.5},children:[(0,v.jsx)(u.Z,{style:{color:"black",fontWeight:700,fontSize:12},children:t.data.staff}),(0,v.jsx)(u.Z,{style:{color:"#7A7A7A",fontWeight:400,fontSize:10},children:t.data.position})]})]}),(0,v.jsx)(w.HH,{type:"source",position:w.Ly.Bottom,id:"b",isConnectable:e,style:{background:"#D6465F",width:"10px",height:"10px"}})]})}};function D(t){var e=t.isEdit,n=((0,j.UO)().id,(0,p.Z)(),(0,j.s0)()),d=(0,Z.I0)(),l=(0,s.useState)(null),D=(0,a.Z)(l,2),z=D[0],I=(D[1],(0,g.kh)().actions),V=(0,T.Cj)().actions,P=((0,Z.v9)(f.s).isShowSidebar,(0,Z.v9)(N.p)),W=P.listOtherSector,O=P.OrgchartDetail,R=(0,b.$)().t,L=(0,w.Rr)(A),_=(0,a.Z)(L,3),B=_[0],F=(_[1],_[2]),$=(0,w.ll)(H),q=(0,a.Z)($,3),G=q[0],M=q[1],U=q[2],J=(0,s.useCallback)((function(t){return M((function(e){return(0,w.Z_)(t,e)}))}),[M]),K=(0,y.cI)({mode:"onSubmit"}),Q=K.handleSubmit,X=(K.control,K.formState.errors,K.setValue);K.reset,K.setError,K.clearErrors,K.watch;(0,s.useEffect)((function(){d(V.fetchListSectorsType())}),[d,V]),(0,s.useEffect)((function(){z&&d(V.getAssetSector(z))}),[d,V,z]),(0,s.useEffect)((function(){}),[e,O,X,d,W]);var Y=function(){var t=(0,r.Z)((0,i.Z)().mark((function t(e){return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return(0,v.jsx)(o.Z,{pb:"43px",mt:"-10px",children:(0,v.jsxs)("form",{onSubmit:Q(Y,(function(t){t&&d(I.updateSnackbar({message:"Vui l\xf2ng ki\u1ec3m tra l\u1ea1i th\xf4ng tin",type:"error"}))})),children:[(0,v.jsxs)(h.ZP,{xs:12,sm:12,sx:{display:"flex",justifyContent:"space-between"},children:[(0,v.jsx)(o.Z,{display:"flex",sx:{alignItems:"center"},children:(0,v.jsx)(u.Z,{fontSize:"20px",fontWeight:700,lineHeight:"24px",children:"Chi ti\u1ebft s\u01a1 \u0111\u1ed3 t\u1ed5 ch\u1ee9c"})}),(0,v.jsx)(c.Z,{flexDirection:"row",children:(0,v.jsx)(x.Z,{title:R(m.I.common.back),sxProps:{background:k.Z.primary.button,color:k.Z.common.white,borderRadius:"8px",width:{md:"93px"}},sxPropsText:{fontSize:"14px",fontWeight:700},handleClick:function(){n(-1)}})})]}),(0,v.jsx)(h.ZP,{container:!0,xs:12,sm:12,sx:{background:"white",mt:"10px",borderRadius:"12px"},children:(0,v.jsx)("div",{style:{width:"100%",height:"90vh"},children:(0,v.jsxs)(w.x$,{nodes:B,edges:G,onNodesChange:F,onEdgesChange:U,onNodeClick:function(t){console.log("node",t)},onConnect:J,nodeTypes:E,attributionPosition:"bottom-left",fitView:!0,children:[(0,v.jsx)(C.Z,{}),(0,v.jsx)(S.A,{gap:15,size:1})]})})})]})})}function z(){return(0,v.jsx)(o.Z,{pb:"43px",children:(0,v.jsx)(D,{})})}}}]);