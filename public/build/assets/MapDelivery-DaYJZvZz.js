import{j as e}from"./vendor-core-exSyXSqW.js";import{L as s}from"./app-Dpu3mrQQ.js";import{M as i,T as o,a as n}from"./TileLayer-Ck5D7tC8.js";import"./app-ho6zMTOc.js";const a=new s.DivIcon({className:"",html:`
        <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            background:#7c3aed;
            width:32px;
            height:32px;
            border-radius:9999px;
            box-shadow:0 4px 10px rgba(0,0,0,.3);
            border:2px solid white;
        ">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M12 2L3 21l9-4 9 4-9-19z"/>
            </svg>
        </div>
    `,iconSize:[32,32],iconAnchor:[16,16]});function c({deliveryLocation:t}){const r=t?[t.lat,t.lng]:[17.4606859,-97.2275336];return e.jsxs(i,{center:r,zoom:16,scrollWheelZoom:!1,style:{height:"100%",width:"100%"},children:[e.jsx(o,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:"© OpenStreetMap contributors"}),t&&e.jsx(n,{position:[t.lat,t.lng],icon:a})]})}export{c as default};
