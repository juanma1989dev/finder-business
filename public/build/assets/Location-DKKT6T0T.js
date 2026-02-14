import{r as l,j as e,u as y}from"./vendor-core-CVn978f7.js";import{c as w,a as N,e as M,u as S,M as L}from"./Map-BuP_MAO0.js";import{l as C,L as f}from"./app-CQrnIAdu.js";import{C as g,a as I}from"./card-CIre8WR5.js";import{I as k}from"./input-CfCOPfo4.js";import{L as p}from"./label-CLYoN36p.js";import{S as z,a as O,b as E,c as T,d as F}from"./select-DPQR3XAZ.js";import{l as u}from"./locations-zddfFc1m.js";import{m as D}from"./dashboard-layout-DBIvlQ1a.js";import{y as h}from"./index-CZyFl0Li.js";import{LayoutBusinessModules as V}from"./LayoutBusinessModules-DwXDoHCj.js";import{a5 as A,s as B,i as H}from"./vendor-icons-BvP0H4xj.js";import"./app-DQJAPa6p.js";import"./utils-szUE-hBx.js";import"./vendor-ui-CpttHis2.js";import"./button--cW8-JAs.js";import"./dropdown-menu-BbU8JRam.js";import"./index-CN9EY2cw.js";import"./index-CVASjcgI.js";import"./index-BU_B9Ap-.js";import"./ProviderLayout-Adcfx3ho.js";import"./firebase-B2pyU7xz.js";const R=w(function({position:a,...t},s){const n=new C.Marker(a,t);return N(n,M(s,{overlayContainer:n}))},function(a,t,s){t.position!==s.position&&a.setLatLng(t.position),t.icon!=null&&t.icon!==s.icon&&a.setIcon(t.icon),t.zIndexOffset!=null&&t.zIndexOffset!==s.zIndexOffset&&a.setZIndexOffset(t.zIndexOffset),t.opacity!=null&&t.opacity!==s.opacity&&a.setOpacity(t.opacity),a.dragging!=null&&t.draggable!==s.draggable&&(t.draggable===!0?a.dragging.enable():a.dragging.disable())});function U({position:r,enabled:a=!0,zoom:t,animate:s=!0}){const n=S();return l.useEffect(()=>{a&&n.flyTo(r,t??n.getZoom(),{animate:s,duration:s?.6:0})},[r,a,t,n]),null}function Z({position:r,draggable:a=!1,icon:t,onDragEnd:s}){return e.jsx(R,{position:r,draggable:a,icon:t,eventHandlers:a&&s?{dragend:n=>{const{lat:d,lng:c}=n.target.getLatLng();s(d,c)}}:void 0})}const $=new f.DivIcon({className:"",html:`
      <div style="
        background:#7c3aed;
        width:36px;
        height:36px;
        border-radius:9999px;
        border:2px solid white;
        box-shadow:0 4px 10px rgba(0,0,0,.3);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 9l1-5h16l1 5" />
          <path d="M5 22V9" />
          <path d="M19 22V9" />
          <path d="M9 22V12h6v10" />
        </svg>
      </div>
    `,iconSize:[32,32],iconAnchor:[16,16]});new f.DivIcon({className:"",html:`
      <div style="
        background:#16a34a;
        width:32px;
        height:32px;
        border-radius:9999px;
        border:2px solid white;
        box-shadow:0 4px 10px rgba(0,0,0,.3);
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white"
             style="margin:7px">
          <path d="M12 2L3 21l9-4 9 4-9-19z"/>
        </svg>
      </div>
    `,iconSize:[32,32],iconAnchor:[16,16]});function xe({business:r}){const a=D({text:"Ubicación",url:"#"}),t=u.NOCHIXTLAN.cords,[s,n]=l.useState(!1),[d,c]=l.useState(!1),{data:o,setData:m,put:b,processing:j}=y({location:r.location,address:r.address,cords:{lat:r?.cords?.coordinates?.[1]??t.lat,long:r?.cords?.coordinates?.[0]??t.long}});l.useEffect(()=>{const i=setTimeout(()=>n(!0),100);return()=>clearTimeout(i)},[]);const v=()=>{b(`/dashboard/business/${r.id}-${r.slug}/location`,{preserveScroll:!0,onSuccess:()=>h.success("Ubicación actualizada correctamente"),onError:()=>h.error("Error al guardar")})};return e.jsxs(V,{titleHead:"Localización",headerTitle:"Ubicación",headerDescription:"Configura la localización física del negocio",buttonText:"Guardar cambios",icon:A,onSubmit:v,processing:j,breadcrumbs:a,children:[e.jsx("div",{className:"space-y-6 lg:col-span-4",children:e.jsx(g,{className:"rounded-lg border-purple-200 shadow-sm",children:e.jsxs(I,{className:"space-y-4 p-3",children:[e.jsxs("div",{children:[e.jsx(p,{className:"mb-1 block text-[10px] font-semibold tracking-widest text-gray-500 uppercase",children:"Municipio / Localidad"}),e.jsxs(z,{value:o.location,onValueChange:i=>{c(!0),m({...o,location:i,cords:u[i].cords,address:""})},children:[e.jsx(O,{children:e.jsx(E,{placeholder:"Seleccionar…"})}),e.jsx(T,{children:Object.entries(u).map(([i,x])=>e.jsx(F,{value:i,children:x.name},i))})]})]}),e.jsxs("div",{children:[e.jsx(p,{className:"mb-1 block text-[10px] font-semibold tracking-widest text-gray-500 uppercase",children:"Dirección"}),e.jsx(k,{value:o.address,onChange:i=>m("address",i.target.value),placeholder:"Calle, número, colonia…"}),e.jsxs("div",{className:"mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2",children:[e.jsx(B,{size:14,className:"text-amber-600"}),e.jsx("p",{className:"flex text-sm text-amber-700",children:"Ajusta el marcador para mayor precisión."})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-2",children:[e.jsxs("div",{className:"rounded-lg border bg-gray-50 p-2 text-center",children:[e.jsx("span",{className:"block text-[9px] text-gray-500 uppercase",children:"Latitud"}),e.jsx("span",{className:"font-mono text-xs",children:o.cords.lat.toFixed(6)})]}),e.jsxs("div",{className:"rounded-lg border bg-gray-50 p-2 text-center",children:[e.jsx("span",{className:"block text-[9px] text-gray-500 uppercase",children:"Longitud"}),e.jsx("span",{className:"font-mono text-xs",children:o.cords.long.toFixed(6)})]})]})]})})}),e.jsx("div",{className:"relative lg:col-span-8",children:e.jsxs(g,{className:"relative h-[520px] overflow-hidden rounded-lg p-0",children:[!s&&e.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-white/60",children:e.jsx(H,{className:"animate-spin"})}),s&&e.jsxs(L,{center:[o.cords.lat,o.cords.long],children:[e.jsx(Z,{position:[o.cords.lat,o.cords.long],draggable:!0,icon:$,onDragEnd:(i,x)=>{c(!1),m("cords",{lat:Number(i.toFixed(6)),long:Number(x.toFixed(6))})}}),e.jsx(U,{enabled:d,position:[o.cords.lat,o.cords.long],zoom:16})]})]})})]})}export{xe as default};
