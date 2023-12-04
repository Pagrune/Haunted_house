import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import textGeometry
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const boisTexture = textureLoader.load('/textures/old-wood.jpg')
const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const graveColorTexture = textureLoader.load('/textures/grave/le-marbre.jpg')
const roofTexture = textureLoader.load('/textures/toit/wood-roof.jpg')
const doorTexture = textureLoader.load('/textures/door/broken-door-2.jpg')
const windowTexture = textureLoader.load('/textures/fenetre/windows.jpg')

/**
 * House
 */

// create a group
const house = new THREE.Group()
const candles = new THREE.Group()
scene.add(candles)
scene.add(house)

// Walls
boisTexture.repeat.set(2, 5);
boisTexture.wrapS = THREE.RepeatWrapping;
boisTexture.wrapT = THREE.RepeatWrapping;

// Mur avec texture répétée
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ map: boisTexture })
);

walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
roofTexture.repeat.set(2, 5);
roofTexture.wrapS = THREE.RepeatWrapping;
roofTexture.wrapT = THREE.RepeatWrapping;

// Créez le matériau du toit avec la texture
const roofMaterial = new THREE.MeshStandardMaterial({
    map: roofTexture,
    side: THREE.DoubleSide
});

// Créez le toit avec la géométrie du cône et le nouveau matériau
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    roofMaterial
);

roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2),
    new THREE.MeshStandardMaterial({ map: doorTexture })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.receiveShadow = true;
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

bush1.receiveShadow = true;
bush2.receiveShadow = true;
bush3.receiveShadow = true;


// add bushes to the house
house.add(bush1, bush2, bush3)

// chimney

const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    new THREE.MeshStandardMaterial({ map: brickColorTexture })
)
chimney.position.y = 2.5 + 0.5 + 0.5
chimney.position.x = 0.75
chimney.position.z = - 0.75
house.add(chimney)

// Smoke particles coming out of the chimney
const smokeParticles = new THREE.BufferGeometry();
const smokePositions = [];

for (let i = 0; i < 1000; i++) {
    smokePositions.push(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5
    );
}

smokeParticles.setAttribute('position', new THREE.Float32BufferAttribute(smokePositions, 3));

const smokeMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#aaaaaa'
});

const smoke = new THREE.Points(smokeParticles, smokeMaterial);
smoke.position.copy(chimney.position); // Position initiale par rapport à la cheminée
smoke.position.y += 0.5; // Ajustement en fonction de la hauteur de la cheminée
house.add(smoke)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// window 
// const windowMaterial = new THREE.MeshStandardMaterial({
//     map: windowTexture,
//     alphaMap: windowTexture, // Utilisez la même texture comme alphaMap
//     transparent: true, // Activez la transparence
// });

// // Créez la fenêtre avec la géométrie du plan et le nouveau matériau
// const window1 = new THREE.Mesh(
//     new THREE.PlaneGeometry(1, 1.2),
//     windowMaterial
// );

// // Assurez-vous que le matériau de la fenêtre utilise la transparence
// windowMaterial.alphaMap = windowTexture;
// windowMaterial.side = THREE.DoubleSide;
const window1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.2),
    new THREE.MeshStandardMaterial({ map: windowTexture })
)

window1.position.y = 1.5
window1.position.z = 2 + 0.01
window1.position.x = -1.2
house.add(window1)

const window2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.2),
    new THREE.MeshStandardMaterial({ map: windowTexture })
)

window2.position.y = 1.5
window2.position.z = 2 + 0.01
window2.position.x = 1.2
house.add(window2)

// windows on each wall
const window3 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({ map: windowTexture })
)

window3.position.y = 1.5
window3.position.z = 2 + 0.01
window3.position.x = 0
window3.position.z = -2
window3.rotation.y = Math.PI
house.add(window3)



// grass
const grassGeometry = new THREE.PlaneGeometry(20, 20)
//use the texture
const grassMaterial = new THREE.MeshStandardMaterial({ map: grassColorTexture })
// const grassMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const grass = new THREE.Mesh(grassGeometry, grassMaterial)
grass.rotation.x = - Math.PI * 0.5
grass.position.y = 0.01

scene.add(grass)

// Floating candles
const candleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 20);
const candleMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff' });

for (let i = 0; i < 10; i++) {
    const candle = new THREE.Mesh(candleGeometry, candleMaterial);
    // add candle wick
    const candleWickGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    const candleWickMaterial = new THREE.MeshStandardMaterial({ color: '#ffff00' });
    const candleWick = new THREE.Mesh(candleWickGeometry, candleWickMaterial);
    candleWick.position.y = 0.25 / 2 + 0.25;
    candle.add(candleWick);

    candle.position.x = (Math.random() - 0.5) * 10;
    candle.position.y = 0.25 / 2 + 3;
    candle.position.z = (Math.random() - 0.5) * 20;
    const scale = Math.random();
    candle.scale.set(scale, scale, scale);

    // Ajoutez une flamme à la bougie
    const flameGeometry = new THREE.ConeGeometry(0.2, 0.5, 20);
    const flameMaterial = new THREE.MeshStandardMaterial({ emissive: '#ff3300', emissiveIntensity: 2 });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 0.25 / 2 + 0.25 + 0.5 / 2;
    candle.add(flame);

   // Ajoutez une lumière à la flamme pour simuler la lueur
   const mainLight = new THREE.PointLight('#ffff00', 3, 5, 2);
   mainLight.position.y = 0.25 / 2 + 0.25 + 0.5 / 2; // Ajustez la position de la lumière
   flame.add(mainLight); // Attachez la lumière principale à la flamme

   // Ajoutez une deuxième lumière pour le halo blanc
   const haloLight = new THREE.PointLight('#ffffff', 1, 5, 2);
   haloLight.position.y = 0.25 / 2 + 0.25 + 0.5 / 2; // Ajustez la position de la lumière
   flame.add(haloLight);
    
    // Ajoutez la bougie à la scène
    candles.add(candle);
}



//stones
const stoneGeometry = new THREE.SphereGeometry(0.5, 10, 10)
const stoneMaterial = new THREE.MeshStandardMaterial({ color: '#383E42' })


// generate random stones
for (let i = 0; i < 50; i++) {
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.x = (Math.random() - 0.5) * 10;
    stone.position.y = (Math.random() - 0.5) * 0.5;
    stone.position.z = (Math.random() - 0.5) * 20;
    stone.rotation.y = (Math.random() - 0.5) * 4;
    stone.rotation.z = (Math.random() - 0.5) * 4;
    const scale = Math.random();
    stone.scale.set(scale, scale, scale);
    house.add(stone);
}

const fontLoader = new FontLoader()
fontLoader.load(
    'helvetiker_regular.typeface.json',
    (font)=>{
        const textMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const stoneGraveGeometry = new THREE.BoxGeometry(2, 0.2, 0.8);
    //use the texture
    const stoneGraveMaterial = new THREE.MeshStandardMaterial({ map: graveColorTexture })
        // const stoneGraveMaterial = new THREE.MeshStandardMaterial({ color: '#a9c388' });
    const nbrGraves = 50;

    for (let i = 0; i < nbrGraves; i++) {
        const stoneGrave = new THREE.Mesh(stoneGraveGeometry, stoneGraveMaterial);

        stoneGrave.position.x = (Math.random() - 0.5) * 10;
        stoneGrave.position.y = 0.25 / 2;
        stoneGrave.position.z = (Math.random() - 0.5) * 20;
        stoneGrave.rotation.y = (Math.random() - 0.5) * 4;
        stoneGrave.rotation.z = (Math.random() - 0.5) * 4;
        const scale = Math.random();
        stoneGrave.scale.set(scale, scale, scale);

        const textGeometry = new TextGeometry('RIP', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
        });

        textGeometry.center();

        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.x = stoneGrave.position.x;
        text.position.y = stoneGrave.position.y + 0.25;
        text.position.z = stoneGrave.position.z - 0.4;
        text.rotation.x = -Math.PI * 0.5;
        text.scale.set(0.3, 0.3, 0.3);

        // stoneGrave.add(text);

        //shadow
        stoneGrave.castShadow = true;
        stoneGrave.receiveShadow = true;

        house.add(stoneGrave);
    }
    }
)


// add fog to the scene
const fog = new THREE.Fog('#262837', 6, 15);

// add more greyish fog
const fog1 = new THREE.FogExp2('#262837', 0.1);

scene.fog = fog1;
// scene.fog = fog;


//received shadows
walls.receiveShadow = true;
walls.castShadow = true;
roof.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;
floor.castShadow = true;
window1.receiveShadow = true;
window1.castShadow = true;
window2.receiveShadow = true;
window2.castShadow = true;
window3.receiveShadow = true;
window3.castShadow = true;
chimney.receiveShadow = true;
chimney.castShadow = true;
grass.receiveShadow = true;
grass.castShadow = true;



/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.08)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// ambientLight.castShadow = true;
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.4)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 1024;
moonLight.shadow.mapSize.height = 1024;
scene.add(moonLight)

// Door light with a point light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// Ghost light with a point light light color
const ghostLight = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghostLight);


//shadows
moonLight.castShadow = true;
doorLight.castShadow = true;
ghostLight.castShadow = true;



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

//smoke
const smokeSpeed = 0.05; // Adjust the speed of the smoke rising
const smokeMaxHeight = 10; // Adjust the maximum height for the smoke

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.setClearColor('#262837')
    renderer.render(scene, camera)

    // Move the smoke upward
    smoke.position.y += smokeSpeed;

    // If the smoke reaches the maximum height, reset its position
    if (smoke.position.y > chimney.position.y + smokeMaxHeight) {
        smoke.position.copy(chimney.position);
        smoke.position.y += 0.8;
    }

    // Update the ghost light
    ghostLight.position.x = Math.sin(elapsedTime * 0.5) * 4;
    ghostLight.position.z = Math.cos(elapsedTime * 0.5) * 4;
    ghostLight.position.y = Math.sin(elapsedTime * 4) + 2;

    const groundLevel = 0.25;
    candles.children.forEach((candle, index) => {
        const delta = Math.sin(elapsedTime + index * 0.5) * 0.1;
    
        // Mettez à jour la position en y
        candle.position.y += delta;
    
        // Vérifiez si la bougie passe en dessous du niveau du sol
        if (candle.position.y < groundLevel) {
            candle.position.y = groundLevel; // Réinitialisez à la hauteur du sol
        }
    
        // Mettez à jour les rotations et positions additionnelles
        candle.rotation.z += delta * 0.5;
        candle.rotation.x += delta * 0.5;
        candle.position.x += delta * 0.5;

        //light intensity variations
        candle.children[0].intensity = 2 + delta * 3;
        candle.children[1].intensity = 1 + delta * 2;

    
        // Vérifiez si la bougie passe à travers la maison
        const intersectsHouse = candle.position.x > -2.5 && candle.position.x < 2.5 && candle.position.z > -2.5 && candle.position.z < 2.5;
        if (intersectsHouse) {
            candle.position.x = Math.random() * 10 - 5;
            candle.position.z = Math.random() * 20 - 10;
        }
    });
    
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()