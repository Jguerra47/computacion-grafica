//Medidas de la camisa
let hips = 102/(Math.PI);
let back = 44;
let height = 79;
let width = hips;
let sleeve = back/3;
const sleeveRad = 45 * Math.PI / 180;

//Limites del canvas y proporción de cambio
const escPix = 5; //1cm --> 5px
const hmax = parseInt(document.getElementById("miCanvas").getAttribute('height'));
const wmax = parseInt(document.getElementById("miCanvas").getAttribute('width'));
const marginbottom = (hmax-(height*escPix))/(2*escPix);
const marginleft = wmax/(2*escPix);

//Puntos a graficar
let positions = [];
const matrices = {
  scalation: [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1],
  translation: [0, 0, 0, 0],
  rotation: [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]
};

function p(x, y){
    return [(2*(((marginleft+x)*escPix)/wmax))-1, (2*(((marginbottom+y)*escPix)/hmax))-1]
}

function addPoints(array){
    array.map(function(x){
        positions.push(x)
    })
}

const program = () => {
    const draw = linkShaders("miCanvas")

    const base = [...p(0, 0), ...p(hips/2, 0)]
    addPoints(base)

    const baseToSleeve = [...p(width/2, (2/3)*height)]
    addPoints(baseToSleeve)
    
    const allSleeve = [
                        ...p(back/2, (2/3)*height-((back-width)/2)/Math.tan(sleeveRad)), //Axila
                        ...p(back/2 + (sleeve * Math.sin(sleeveRad)), height-5-(sleeve*Math.cos(sleeveRad))), //Salida del brazo
                        ...p(back/2, height-5) //Hombro
                    ]
    addPoints(allSleeve)

    const shoulder = [...p(hips/4, height)]
    addPoints(shoulder)
    
    //Completar la otra mitad de la camisa haciendo 'mirror' en el eje Y
    positions.map((_, i) =>{     
      if (i%2 == 0) positions.push((-positions[positions.length-2-2*i]), positions[(positions.length)-1-i*2])
    })
    draw(positions, matrices, erase=true)

    //Añadir puntos del cuello
    let neck = []
    const X = [hips/4, hips/8, -hips/8, (-hips/4)]
    const Y = [height, height-10, height-10,height]
    for(let t = 0; t <= 10; t++){
        neck.push(...p(deCasteljau(t/10, X), deCasteljau(t/10, Y)))
    }
    draw(neck, matrices, erase=false)
}
window.onload = program

//Transformaciones
document.getElementById("rotate").addEventListener("change", (e) => {
  const rotate = -e.target.value*Math.PI/180; //El negativo le brinda la rotación hacia la derecha
  document.getElementById("rotate-label").innerHTML = e.target.value+"°";
  matrices.rotation = [Math.cos(rotate), -Math.sin(rotate), 0,0,
                      Math.sin(rotate), Math.cos(rotate), 0,0,
                      0,0,1,0,
                      0,0,0,1
                    ]
  positions = [];
  program();
});
document.getElementById("scaleX").addEventListener("change", (e) => {
  matrices.scalation[0] = e.target.value/1
  document.getElementById("scaleX-label").innerHTML = e.target.value;  
  positions = [];
  program();
});
document.getElementById("scaleY").addEventListener("change", (e) => {
  matrices.scalation[5] = e.target.value/1
  document.getElementById("scaleY-label").innerHTML = e.target.value;  
  positions = [];
  program();
});
document.getElementById("moveX").addEventListener("change", (e) => {
  matrices.translation[0] = e.target.value/60
  document.getElementById("moveX-label").innerHTML = e.target.value + " cm";  
  positions = [];
  program();
});
document.getElementById("moveY").addEventListener("change", (e) => {
  matrices.translation[1] = e.target.value/60
  document.getElementById("moveY-label").innerHTML = e.target.value + " cm";  
  positions = [];
  program();
});


//Medidas de la camiseta
document.getElementById("hips").addEventListener("change", (e) => {
    hips = e.target.value / Math.PI;
    document.getElementById("hips-label").innerHTML = e.target.value + " cm";
    positions = [];
    program();
});
document.getElementById("width").addEventListener("change", (e) => {
    width = e.target.value / Math.PI;
    document.getElementById("width-label").innerHTML = e.target.value + " cm";
    positions = [];
    program();
});
document.getElementById("height").addEventListener("change", (e) => {
    height = e.target.value / 1;
    document.getElementById("height-label").innerHTML = e.target.value + " cm";
    positions = [];
    program();
});
document.getElementById("back").addEventListener("change", (e) => {
    back = e.target.value / 1;
    sleeve = back/3;
    document.getElementById("back-label").innerHTML = e.target.value + " cm";
    positions = [];
    program();
});
