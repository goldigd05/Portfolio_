/* ---------- Hero 3D node network (Three.js) ---------- */
(function(){
  const canvas = document.getElementById('nodeCanvas');
  if(!canvas || !window.THREE) return;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  function size(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  }
  size();

  const group = new THREE.Group();
  scene.add(group);

  // Nodes at random points (IoT network feel)
  const NODE_COUNT = 46;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({color:0x7C6FEF});
  const nodeMat2 = new THREE.MeshBasicMaterial({color:0x33D6A6});

  for(let i=0;i<NODE_COUNT;i++){
    const r = 4.2;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos((Math.random()*2)-1);
    const v = new THREE.Vector3(
      r*Math.sin(phi)*Math.cos(theta),
      r*Math.sin(phi)*Math.sin(theta)*0.6,
      r*Math.cos(phi)
    );
    const mesh = new THREE.Mesh(nodeGeo, Math.random()>0.85?nodeMat2:nodeMat);
    mesh.position.copy(v);
    group.add(mesh);
    nodes.push(v);
  }

  // Connect nearby nodes with thin lines
  const lineMat = new THREE.LineBasicMaterial({color:0x7C6FEF, transparent:true, opacity:0.18});
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      if(nodes[i].distanceTo(nodes[j]) < 2.1){
        const g = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
        group.add(new THREE.Line(g, lineMat));
      }
    }
  }

  let mouseX=0, mouseY=0;
  window.addEventListener('mousemove', e=>{
    mouseX = (e.clientX/window.innerWidth - 0.5);
    mouseY = (e.clientY/window.innerHeight - 0.5);
  });

  function animate(){
    requestAnimationFrame(animate);
    group.rotation.y += 0.0016;
    group.rotation.x += (mouseY*0.3 - group.rotation.x)*0.02;
    group.rotation.y += (mouseX*0.15)*0.01;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', size);
})();

/* ---------- Hero text reveal on load ---------- */
window.addEventListener('load', ()=>{
  document.getElementById('hero').classList.add('loaded');
});

/* ---------- Scroll reveal for sections ---------- */
const revealEls = document.querySelectorAll('.reveal-up');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* ---------- Custom cursor ---------- */
const cursorDot = document.getElementById('cursorDot');
if(cursorDot && matchMedia('(hover:hover)').matches){
  window.addEventListener('mousemove', e=>{
    cursorDot.style.left = e.clientX+'px';
    cursorDot.style.top = e.clientY+'px';
  });
}

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle){
  navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> navLinks.classList.remove('open')));
}

/* ---------- Contact form (FormSubmit.co — no backend/API key needed) ---------- */
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending…';
    fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}})
      .then(res=>{
        if(res.ok){
          statusEl.textContent = "Sent — I'll get back to you soon.";
          form.reset();
        } else {
          statusEl.textContent = 'Something went wrong — please email me directly.';
        }
      })
      .catch(()=>{ statusEl.textContent = 'Something went wrong — please email me directly.'; })
      .finally(()=>{ btn.textContent = 'Send message'; });
  });
}
