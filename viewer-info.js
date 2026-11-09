// Shared visual and keyboard behavior for viewer instruction panels.
export function createViewerInfo(id, label, rows, className='') {
  const info=document.createElement('div'); info.className=`snapshot-info ${className}`;
  const button=document.createElement('button'); button.className='snapshot-info-button'; button.type='button';
  button.setAttribute('aria-label',label); button.setAttribute('aria-controls',id); button.setAttribute('aria-expanded','false');
  const ns='http://www.w3.org/2000/svg';
  const icon=document.createElementNS(ns,'svg'); icon.setAttribute('viewBox','0 0 24 24'); icon.setAttribute('aria-hidden','true');
  for(const [tag,attributes] of [['circle',{cx:12,cy:12,r:9,fill:'none',stroke:'currentColor','stroke-width':2}],['circle',{cx:12,cy:7,r:1,fill:'currentColor'}],['path',{d:'M12 11v6',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round'}]]) {
    const node=document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attributes)) node.setAttribute(key,value);
    icon.append(node);
  }
  button.append(icon);
  const panel=document.createElement('div'); panel.className='snapshot-info-panel'; panel.id=id;
  panel.setAttribute('role','note'); panel.setAttribute('aria-hidden','true'); panel.inert=true;
  for(const {gesture,action} of rows) {
    const line=document.createElement('p'),title=document.createElement('strong'); title.textContent=`${gesture}: `;
    line.append(title,document.createTextNode(action)); panel.append(line);
  }
  // Preserve the reference appearance while fitting panels near screen edges.
  const positionPanel=()=>{
    const anchor=(info.offsetParent || info).getBoundingClientRect();
    const height=window.innerHeight,width=window.innerWidth;
    panel.style.maxHeight=`${Math.max(1,height-16)}px`;
    const below=height-anchor.bottom-8,above=anchor.top-8;
    const down=panel.offsetHeight<=below || below>=above;
    panel.style.maxHeight=`${Math.max(1,down?below:above)}px`;
    panel.style.top=down?`${anchor.height+6}px`:`${-panel.offsetHeight-6}px`;
    panel.style.bottom='auto';
    panel.style.left=`${Math.max(8,Math.min(anchor.left,width-panel.offsetWidth-8))-anchor.left}px`;
    panel.style.transformOrigin=down?'top left':'bottom left';
    return anchor.bottom>=8 && anchor.top<=height-8;
  };
  const setOpen=open=>{
    if(open) positionPanel();
    panel.classList.toggle('is-open',open); panel.inert=!open;
    panel.setAttribute('aria-hidden',String(!open)); button.setAttribute('aria-expanded',String(open));
  };
  button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
  document.addEventListener('click',event=>{if(!info.contains(event.target)) setOpen(false);});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true') {setOpen(false);button.focus();}
  });
  const reposition=()=>{
    if(button.getAttribute('aria-expanded')==='true' && !positionPanel()) setOpen(false);
  };
  window.addEventListener('resize',reposition);
  document.addEventListener('scroll',reposition,{capture:true,passive:true});
  info.append(button,panel); return info;
}
