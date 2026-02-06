import{r as u,G as x,j as f}from"./vendor-core-exSyXSqW.js";import{l as h,L as w}from"./app-Lsx9vzYk.js";function k(t,n){const e=u.useRef(n);u.useEffect(function(){n!==e.current&&t.attributionControl!=null&&(e.current!=null&&t.attributionControl.removeAttribution(e.current),n!=null&&t.attributionControl.addAttribution(n)),e.current=n},[t,n])}const H=1;function S(t){return Object.freeze({__version:H,map:t})}function T(t,n){return Object.freeze({...t,...n})}const g=u.createContext(null);function b(){const t=u.use(g);if(t==null)throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");return t}function A(t){function n(e,r){const{instance:i,context:o}=t(e).current;u.useImperativeHandle(r,()=>i);const{children:a}=e;return a==null?null:x.createElement(g,{value:o},a)}return u.forwardRef(n)}function N(t){function n(e,r){const{instance:i}=t(e).current;return u.useImperativeHandle(r,()=>i),null}return u.forwardRef(n)}function V(t,n){const e=u.useRef(void 0);u.useEffect(function(){return n!=null&&t.instance.on(n),e.current=n,function(){e.current!=null&&t.instance.off(e.current),e.current=null}},[t,n])}function v(t,n){const e=t.pane??n.pane;return e?{...t,pane:e}:t}function C(t,n,e){return Object.freeze({instance:t,context:n,container:e})}function p(t,n){return n==null?function(r,i){const o=u.useRef(void 0);return o.current||(o.current=t(r,i)),o}:function(r,i){const o=u.useRef(void 0);o.current||(o.current=t(r,i));const a=u.useRef(r),{instance:s}=o.current;return u.useEffect(function(){a.current!==r&&(n(s,r,a.current),a.current=r)},[s,r,n]),o}}function B(t,n){u.useEffect(function(){return(n.layerContainer??n.map).addLayer(t.instance),function(){n.layerContainer?.removeLayer(t.instance),n.map.removeLayer(t.instance)}},[n,t])}function E(t){return function(e){const r=b(),i=t(v(e,r),r);return k(r.map,e.attribution),V(i.current,e.eventHandlers),B(i.current,r),i}}function _(t,n){const e=p(t,n),r=E(e);return A(r)}function G(t,n){const e=p(t,n),r=E(e);return N(r)}function Z(t,n,e){const{opacity:r,zIndex:i}=n;r!=null&&r!==e.opacity&&t.setOpacity(r),i!=null&&i!==e.zIndex&&t.setZIndex(i)}function K(){return b().map}function D({bounds:t,boundsOptions:n,center:e,children:r,className:i,id:o,placeholder:a,style:s,whenReady:d,zoom:m,...M},I){const[R]=u.useState({className:i,id:o,style:s}),[c,O]=u.useState(null),y=u.useRef(void 0);u.useImperativeHandle(I,()=>c?.map??null,[c]);const j=u.useCallback(L=>{if(L!==null&&!y.current){const l=new h.Map(L,M);y.current=l,e!=null&&m!=null?l.setView(e,m):t!=null&&l.fitBounds(t,n),d!=null&&l.whenReady(d),O(S(l))}},[]);u.useEffect(()=>()=>{c?.map.remove()},[c]);const z=c?x.createElement(g,{value:c},r):a??null;return x.createElement("div",{...R,ref:j},z)}const U=u.forwardRef(D),X=_(function({position:n,...e},r){const i=new h.Marker(n,e);return C(i,T(r,{overlayContainer:i}))},function(n,e,r){e.position!==r.position&&n.setLatLng(e.position),e.icon!=null&&e.icon!==r.icon&&n.setIcon(e.icon),e.zIndexOffset!=null&&e.zIndexOffset!==r.zIndexOffset&&n.setZIndexOffset(e.zIndexOffset),e.opacity!=null&&e.opacity!==r.opacity&&n.setOpacity(e.opacity),n.dragging!=null&&e.draggable!==r.draggable&&(e.draggable===!0?n.dragging.enable():n.dragging.disable())}),q=G(function({url:n,...e},r){const i=new h.TileLayer(n,v(e,r));return C(i,r)},function(n,e,r){Z(n,e,r);const{url:i}=e;i!=null&&i!==r.url&&n.setUrl(i)});function Q({center:t,zoom:n=16,children:e,scrollWheelZoom:r=!1,className:i}){return f.jsx("div",{className:i??"h-full w-full",children:f.jsxs(U,{center:t,zoom:n,scrollWheelZoom:r,style:{height:"100%",width:"100%"},children:[f.jsx(q,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:"© OpenStreetMap contributors"}),e]})})}function W({position:t,draggable:n=!1,icon:e,onDragEnd:r}){return f.jsx(X,{position:t,draggable:n,icon:e,eventHandlers:n&&r?{dragend:i=>{const{lat:o,lng:a}=i.target.getLatLng();r(o,a)}}:void 0})}const Y=new w.DivIcon({className:"",html:`
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
    `,iconSize:[32,32],iconAnchor:[16,16]}),$=new w.DivIcon({className:"",html:`
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
    `,iconSize:[32,32],iconAnchor:[16,16]});export{Q as M,W as a,Y as b,$ as d,K as u};
