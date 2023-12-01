class OrbitingPlanet {
  constructor(){
    // RENDERER ///////////////////////////////////////////////
    // Set up the renderer
    this.renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // SCENE /////////////////////////////////////////////////
    //Create an empty scene
    this.scene = new THREE.Scene();

    // CAMERA ////////////////////////////////////////////////
    // Create camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    // Positon camera
    this.camera.position.set( 0, 0, 100 );
    this.scene.add(this.camera);
  
  
    // LIGHTS /////////////////////////////////////////////////
    // Set up ambient lighting
    const ambientLight = new THREE.AmbientLightProbe(0xffffff, 0.3);
    this.scene.add(ambientLight);

    // Set up directional light
    const directionalLight = new THREE.DirectionalLight( 0xffff00, 2 );
    directionalLight.position.set( 1, 0, 0 );
    this.scene.add(directionalLight);  
  }
  
  start(){
    // BUILDING THE COMPOSITION //////////////////////////////////////////////
    
     // Load 2D texture image for the plane
    const gridTexture = new THREE.TextureLoader().load( "https://res.cloudinary.com/vjy/image/upload/c_fit,h_ih,w_ih/kdsaeye4m3eajlq5m0x4" );
    
    // Set texture properties
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set( 2, 2 );
    
    // Set up sphere geometry and map the grid texture to the material

    const sphereGeom = new THREE.SphereGeometry( 20, 30, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial( {
       map: gridTexture
    } );
    // Create a grid sphere mesh
    this.gridSphere = new THREE.Mesh( sphereGeom, sphereMaterial );
    this.scene.add( this.gridSphere );

    // Set up planet geometry and material 
    const planetGeom = new THREE.SphereGeometry( 10, 30, 16);
    const planetMaterial = new THREE.MeshStandardMaterial( {
       color: 0x00ff00
    } );
    // Create planet mesh
    this.planetMesh = new THREE.Mesh( planetGeom, planetMaterial );
    this.planetMesh.position.set(-100, 0, 0);
    this.scene.add( this.planetMesh );
   
    // Set up rocket body geometry and material 
    const rocketBodyGeom =  new THREE.BoxGeometry( 5, 5, 5);;
    const rocketBodyMaterial = new THREE.MeshStandardMaterial( {
       color: 0xff0000
    } );
    // Create rocket body mesh
    this.rocketBodyMesh = new THREE.Mesh( rocketBodyGeom, rocketBodyMaterial );
    this.rocketBodyMesh.position.set(0, 10, 0);
    // Add rocket body to the planet mesh
    this.planetMesh.add( this.rocketBodyMesh );
    
    // Set up nose cone geometry and material 
    const noseConeGeom = new THREE.ConeGeometry( 4, 5, 32);
    const noseConeMaterial = new THREE.MeshStandardMaterial( {
       color: 0x00ffff
    } );
    // Create nose cone mesh
    this.noseConeMesh = new THREE.Mesh( noseConeGeom, noseConeMaterial );
    this.noseConeMesh.position.set(0, 5, 0);
    // Add nose cone to the rocket's body mesh
    this.rocketBodyMesh.add( this.noseConeMesh );
    // Set orbitRadius
    this.orbitRadius = 50;
  }
  // Updating the composition ( called every frame, 60fps) put animation / interaction here 
  // dt - time elapsed since last call to update function, in seconds. Should be close to 0.016 if the rendering is at 60FPS
  //////////////////////////////////////////
  update(dt){
    this.gridSphere.rotation.y = 0.5 * dt;
    // Make planet perform a circular orbit around the grid sphere 
    this.planetMesh.position.set( 
      Math.sin(dt) * this.orbitRadius, 
      0, 
      Math.cos(dt) * this.orbitRadius
    );
    // Reset rocket's position if distance is over max limit
    if(this.rocketBodyMesh.position.y > 50) {
      this.rocketBodyMesh.position.y = 0;
    } 
    this.rocketBodyMesh.position.y += 0.5;
    this.rocketBodyMesh.rotation.y = 10 * dt;
    // Render the scene to the screen (draw it to the screen)
    this.renderer.render(this.scene, this.camera);
  }
} // End of Class

// Creating the composition
let comp = new OrbitingPlanet();

// Starting the composition
comp.start();

// Requesting animation frame and calculating time
let time=Date.now();
let dt = 0;
function animate(){
  let oldtime=time;
  time=Date.now();
  dt += (time-oldtime)/1000
  comp.update(dt);
  requestAnimationFrame(animate);
}
animate();

// Javascript event listener that checks if the screen is being resized and adjust the frame accordingly
window.addEventListener('resize', function()
	{
	var width = window.innerWidth;
	var height = window.innerHeight;
	comp.renderer.setSize( width, height );
	comp.camera.aspect = width / height;
	comp.camera.updateProjectionMatrix();
	} );