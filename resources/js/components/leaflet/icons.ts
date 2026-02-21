import L from 'leaflet';

export const businessIcon = new L.DivIcon({
    className: '',
    html: `
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
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

export const deliveryIcon = new L.DivIcon({
    className: '',
    html: `
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
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});
