/*********************************************************
TODO:

* добавить планет
* трасса планеты

* пролет черной дыры, падение на солнце, столкновение планет, астероиды, кометы

***********************************************************/



//// GLOBALS  ////////////////////////
var canvas, model, view, camera;
//////////////////////////////////////

window.addEventListener("load", init);

function init()
{
    canvas = document.getElementById("canvas1");

    model = new Model(canvas.width, canvas.height);
    model.balls = [
        new Ball({ x: 0, y: 0, r: 80, m: 10000, vx: 0, vy: 0, spin: 0.002 }),    // sun   1080/332830
        new Ball({ x: 200, y: 0, r: 4, m: 0.06, vx: 0, vy: 0, spin: 0.1 }),      // merkury
        new Ball({ x: 300, y: 0, r: 9.5, m: 0.81, vx: 0, vy: 0, spin: 0.1 }),    // venus
        new Ball({ x: 400, y: 0, r: 10, m: 1, vx: 0, vy: 0, spin: 0.1 }),        // earth   r/m
        new Ball({ x: 500, y: 0, r: 5.3, m: 0.1, vx: 0, vy: 0, spin: 0.1 }),     // mars 
        new Ball({ x: 700, y: 0, r: 30, m: 10, vx: 0, vy: 0, spin: 0.1 }),       // jupiter 112/317
        new Ball({ x: 900, y: 0, r: 20, m: 5, vx: 0, vy: 0, spin: 0.1 }),        // saturn
        new Ball({ x: -2000, y: 1000, r: 5, m: 10000, vx: 0.1, vy: 0, spin: 0 }),  // BLACK HOLE
    ];
    for (var i = 1; i < model.balls.length; i++) {
        if (!model.balls[i].vx)
           model.tangVelo(model.balls[i]);
    }
      
    view = new View3D(model, canvas);
}




