(function(){
'use strict';
var grid=document.getElementById('games');
if(!grid)return;

/* Dibujos de las tarjetas. Son fijos y del propio sitio; el nombre del icono viene de juegos.json. */
var ICONS={
 botella:'<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="8" y="78" width="38" height="7" rx="2" fill="var(--gold)"/><rect x="14" y="85" width="5" height="26" fill="var(--gold)"/><rect x="35" y="85" width="5" height="26" fill="var(--gold)"/><rect x="80" y="92" width="32" height="7" rx="2" fill="var(--teal)"/><rect x="84" y="99" width="5" height="12" fill="var(--teal)"/><rect x="103" y="99" width="5" height="12" fill="var(--teal)"/><g transform="rotate(25 62 40)"><path d="M54 62h16v-24l-4-6v-10h-8v10l-4 6z" fill="#cfeaf7" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/><rect x="55.5" y="42" width="13" height="16" fill="#58b8ee"/><rect x="58" y="20" width="8" height="5" fill="var(--cap)"/></g><path d="M34 68q14-34 40-8" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="5 6" stroke-linecap="round"/></svg>',
 gomera:'<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 112V66M60 66L36 28M60 66L84 28" fill="none" stroke="var(--gold)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 28L60 48L84 28" fill="none" stroke="var(--cap)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="50" r="7" fill="var(--ink)"/></svg>',
 penal:'<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M14 98V36h92v62" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"/><path d="M28 36v62M44 36v62M60 36v62M76 36v62M92 36v62M14 56h92M14 76h92" stroke="var(--line)" stroke-width="2"/><circle cx="78" cy="94" r="13" fill="#fff" stroke="var(--ink)" stroke-width="4"/><path d="M78 86l6 5-2 7h-8l-2-7z" fill="var(--ink)"/></svg>',
 golf:'<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="100" rx="52" ry="12" fill="var(--teal)"/><ellipse cx="82" cy="98" rx="10" ry="4" fill="var(--ink)"/><path d="M82 96V22" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><path d="M82 22l24 11-24 11z" fill="var(--cap)"/><circle cx="30" cy="92" r="8" fill="#fff" stroke="var(--ink)" stroke-width="3"/></svg>',
 joystick:'<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="10" y="38" width="100" height="56" rx="26" fill="var(--panel)" stroke="var(--ink)" stroke-width="5"/><path d="M36 54v24M24 66h24" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><circle cx="82" cy="58" r="7" fill="var(--cap)"/><circle cx="97" cy="72" r="7" fill="var(--teal)"/></svg>'
};

/* Si no se puede leer juegos.json (por ejemplo, al abrir el archivo suelto) se muestran estos. */
var DEFAULTS=[
 {nombre:'Botellitas Saltarinas',descripcion:'Tocá una, dos o tres veces para saltar con la botella hasta la meta.',archivo:'juegos/botellitas.html',estado:'jugable',icono:'botella'},
 {nombre:'Gomera Loca',descripcion:'Una gomera contra pollos voladores.',archivo:'',estado:'proximamente',icono:'gomera'},
 {nombre:'Penal a Pedo',descripcion:'Penales muy divertidos.',archivo:'',estado:'proximamente',icono:'penal'},
 {nombre:'Pis al Golf',descripcion:'Un golf distinto con una barra de potencia.',archivo:'',estado:'proximamente',icono:'golf'}
];

function el(tag,cls,text){
  var n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text)n.textContent=text;
  return n;
}
function render(list){
  grid.textContent='';
  list.forEach(function(g){
    if(!g||!g.nombre)return;
    /* solo se aceptan archivos HTML de la carpeta juegos/ */
    var ok=/^juegos\/[A-Za-z0-9._-]+\.html$/.test(g.archivo||'');
    var play=ok&&g.estado!=='proximamente';
    var card=el('article','game');
    card.appendChild(el('span','badge'+(play?' live':''),play?'Para jugar ya':'Próximamente'));
    var ico=el('div','ico');
    ico.setAttribute('aria-hidden','true');
    if(/^juegos\/[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp|svg)$/i.test(g.imagen||'')){
      var im=document.createElement('img');im.src=g.imagen;im.alt='';im.style.maxWidth='150px';ico.appendChild(im);
    }else{
      ico.innerHTML=ICONS[g.icono]||ICONS.joystick;
    }
    card.appendChild(ico);
    card.appendChild(el('h3','',g.nombre));
    if(g.descripcion)card.appendChild(el('p','',g.descripcion));
    if(play){
      var a=el('a','btn primary','Jugar');a.href=g.archivo;card.appendChild(a);
    }else{
      var s=el('span','btn','En camino');s.setAttribute('aria-disabled','true');s.style.opacity='.55';s.style.cursor='default';card.appendChild(s);
    }
    grid.appendChild(card);
  });
}

fetch('juegos.json',{cache:'no-store'}).then(function(r){
  if(!r.ok)throw new Error('http '+r.status);
  return r.json();
}).then(function(list){
  render(Array.isArray(list)&&list.length?list:DEFAULTS);
}).catch(function(){
  render(DEFAULTS);
});
})();
