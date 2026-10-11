(function(){
'use strict';
var form=document.getElementById('f'),cv=document.getElementById('draw'),ctx=cv.getContext('2d');
var msg=document.getElementById('msg'),send=document.getElementById('send'),idea=document.getElementById('idea'),count=document.getElementById('count');
var color='#10222D',size=10,erase=false,drawn=false,hist=[],down=false,last=null;

function blank(){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);}
blank();ctx.lineCap='round';ctx.lineJoin='round';

function pos(e){
  var r=cv.getBoundingClientRect();
  return {x:(e.clientX-r.left)*cv.width/r.width,y:(e.clientY-r.top)*cv.height/r.height};
}
function line(a,b){
  ctx.strokeStyle=erase?'#ffffff':color;ctx.lineWidth=erase?size*1.8:size;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
}
cv.addEventListener('pointerdown',function(e){
  e.preventDefault();
  try{cv.setPointerCapture(e.pointerId);}catch(err){}
  hist.push(ctx.getImageData(0,0,cv.width,cv.height));
  if(hist.length>15)hist.shift();
  down=true;drawn=true;last=pos(e);line(last,{x:last.x+0.01,y:last.y});
});
cv.addEventListener('pointermove',function(e){
  if(!down)return;e.preventDefault();
  var p=pos(e);line(last,p);last=p;
});
function up(){down=false;last=null;}
cv.addEventListener('pointerup',up);
cv.addEventListener('pointercancel',up);

function press(group,btn){
  var all=group.querySelectorAll('[aria-pressed]');
  for(var i=0;i<all.length;i++)all[i].setAttribute('aria-pressed','false');
  btn.setAttribute('aria-pressed','true');
}
var sws=document.querySelectorAll('.sw');
for(var i=0;i<sws.length;i++){
  sws[i].addEventListener('click',function(){
    color=this.getAttribute('data-c');erase=false;
    press(this.parentNode,this);
    document.getElementById('eraser').setAttribute('aria-pressed','false');
  });
}
var sizes=document.querySelectorAll('.tool[data-s]');
for(var j=0;j<sizes.length;j++){
  sizes[j].addEventListener('click',function(){
    size=+this.getAttribute('data-s');
    for(var k=0;k<sizes.length;k++)sizes[k].setAttribute('aria-pressed','false');
    this.setAttribute('aria-pressed','true');
  });
}
document.getElementById('eraser').addEventListener('click',function(){
  erase=!erase;this.setAttribute('aria-pressed',erase?'true':'false');
});
document.getElementById('undo').addEventListener('click',function(){
  if(!hist.length)return;
  ctx.putImageData(hist.pop(),0,0);
  drawn=hist.length>0;
});
document.getElementById('clear').addEventListener('click',function(){
  if(drawn)hist.push(ctx.getImageData(0,0,cv.width,cv.height));
  blank();drawn=false;
});

idea.addEventListener('input',function(){
  var left=400-idea.value.length;
  count.textContent=left+' letras disponibles';
});

function say(text,kind){
  msg.hidden=false;msg.textContent=text;msg.className='status '+(kind||'');
}

form.addEventListener('submit',function(e){
  e.preventDefault();
  var text=idea.value.trim();
  if(!text&&!drawn){say('Escribí tu idea o hacé un dibujo.','err');return;}
  if(!document.getElementById('permiso').checked){say('Pedile a un adulto que te ayude y marcá el casillero.','err');return;}
  var fd=new FormData(form);
  fd.delete('dibujo');
  fd.set('form-name','ideas');
  send.disabled=true;say('Enviando…','');
  function go(blob){
    if(blob)fd.set('dibujo',blob,'dibujo.png');
    fetch('/',{method:'POST',body:fd}).then(function(r){
      if(!r.ok)throw new Error('http '+r.status);
      form.hidden=true;msg.hidden=true;
      document.getElementById('thanks').hidden=false;
      window.scrollTo(0,0);
    }).catch(function(){
      send.disabled=false;
      say('No se pudo enviar. Probá de nuevo en un rato. Si abriste este archivo desde tu compu, el envío solo funciona con el sitio publicado.','err');
    });
  }
  if(drawn){cv.toBlob(function(b){go(b);},'image/png');}else{go(null);}
});

/* La lista de juegos del formulario sale de juegos.json */
fetch('juegos.json',{cache:'no-store'}).then(function(r){return r.json();}).then(function(lista){
  var sel=document.getElementById('juego');
  if(!Array.isArray(lista)||!sel)return;
  sel.textContent='';
  lista.forEach(function(g){
    if(g&&g.nombre){var o=document.createElement('option');o.textContent=g.nombre;sel.appendChild(o);}
  });
  var n=document.createElement('option');n.textContent='Un juego nuevo';sel.appendChild(n);
}).catch(function(){});
})();
