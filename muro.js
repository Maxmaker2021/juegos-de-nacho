(function(){
'use strict';
var wall=document.getElementById('wall'),empty=document.getElementById('empty'),sel=document.getElementById('fj');
var items=[];

function el(tag,cls,text){
  var n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text)n.textContent=text;
  return n;
}
function safeImg(p){
  /* solo imágenes de la carpeta dibujos/ del propio sitio */
  return typeof p==='string'&&/^dibujos\/[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp)$/i.test(p);
}
function render(){
  wall.textContent='';
  var f=sel.value,shown=0;
  items.forEach(function(it){
    if(f&&it.juego!==f)return;
    shown++;
    var card=el('article','idea');
    var meta=el('div','meta');
    meta.appendChild(el('span','',it.tipo||'Idea'));
    if(it.juego)meta.appendChild(el('span','',it.juego));
    if(it.fecha)meta.appendChild(el('span','',it.fecha));
    card.appendChild(meta);
    if(safeImg(it.dibujo)){
      var im=document.createElement('img');
      im.src=it.dibujo;im.loading='lazy';im.alt='Dibujo de '+(it.apodo||'un chico o una chica');
      card.appendChild(im);
    }
    if(it.texto)card.appendChild(el('p','',it.texto));
    card.appendChild(el('span','hint','De '+(it.apodo||'alguien anónimo')));
    if(it.respuesta){
      var r=el('div','reply');
      r.appendChild(el('b','','Nacho dice: '));
      r.appendChild(document.createTextNode(it.respuesta));
      card.appendChild(r);
    }
    wall.appendChild(card);
  });
  empty.hidden=shown>0;
  if(!shown)empty.textContent=items.length?'No hay ideas para este juego todavía.':'Todavía no hay ideas publicadas. ¡Mandá la primera!';
}
sel.addEventListener('change',render);

fetch('ideas.json',{cache:'no-store'}).then(function(r){
  if(!r.ok)throw new Error('http '+r.status);
  return r.json();
}).then(function(data){
  items=Array.isArray(data)?data.slice().reverse():[];
  var seen={};
  items.forEach(function(it){
    if(it.juego&&!seen[it.juego]){seen[it.juego]=1;var o=document.createElement('option');o.value=it.juego;o.textContent=it.juego;sel.appendChild(o);}
  });
  render();
}).catch(function(){
  empty.hidden=false;
  empty.textContent='No se pudo cargar el muro. Abrilo desde el sitio publicado.';
});
})();
