//Medidas de la camisa
let hips = 106/(Math.PI);
let back = 46;
let height = 75;
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

function bezierCurve(X, Y, t){
  let arr = []
  for(let i = 0; i <= t; i++){
    arr.push(...p(deCasteljau(i/t, X), deCasteljau(i/t, Y)))
  }
  return arr
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

    //const shoulder = [...p(hips/4, height)]
    //addPoints(shoulder) --> Dibuja recto al solo agregar un punto
    addPoints(bezierCurve([back/2,hips/2,hips/4],
                          [height-5,height-2,height-3,height], 10))    
    draw(positions, matrices, erase=true)

    //Completar la otra mitad de la camisa haciendo 'mirror' en el eje Y
    const mirrored = []
    positions.map((c, i) =>{
      (i%2 == 0) ? mirrored.push(-c) : mirrored.push(c)
    })
    draw(mirrored, matrices, erase=false)    

    //Añadir puntos del cuello
    const neck = [...bezierCurve([hips/4, hips/8, -hips/8, -hips/4],
                              [height, height-10, height-10,height], 8),
                ...bezierCurve([-((hips/4)+1), -hips/8, hips/8, (hips/4)+1],
                              [height-0.3, height-11.3, height-11.3,height-0.3], 8),
                ...p(hips/4,height),
                ...bezierCurve([hips/4, hips/8, -hips/8, -hips/4],
                              [height, height+1, height+1,height], 3),
                ...bezierCurve([-((hips/4)-0.5), -hips/8, hips/8, (hips/4)-0.5],
                              [height-1, height, height,height-1], 3)
                  ]
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
  matrices.translation[0] = e.target.value/(wmax/10)
  document.getElementById("moveX-label").innerHTML = e.target.value + " cm";  
  positions = [];
  program();
});
document.getElementById("moveY").addEventListener("change", (e) => {
  matrices.translation[1] = e.target.value/(hmax/10)
  document.getElementById("moveY-label").innerHTML = e.target.value + " cm";  
  positions = [];
  program();
});

//Medidas de la camiseta
document.getElementById("hips").addEventListener("change", (e) => {
    hips = e.target.value / (Math.PI);
    document.getElementById("hips-label").innerHTML = e.target.value + " cm";
    positions = [];
    program();
});
document.getElementById("width").addEventListener("change", (e) => {
    width = e.target.value / (Math.PI);
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
