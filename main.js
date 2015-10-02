/*********************************************************
TODO:
* добавить полупрозрачную плоскость эклиптики
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
         new Ball({ x: 0, y: 0, r: 70, m: 1000, vx: 0, vy: 0, spin: -0.002 }),
         new Ball({ x: 250, y: 0, r: 30, m: 2, vx: 0, vy: 0, spin: -0.1 }),
         new Ball({ x: -450, y: 0, r: 30, m: 1, vx: 0, vy: 0, spin: -0.1 }),
      ];
      for (var i = 1; i < model.balls.length; i++) {
         model.tangVelo(model.balls[i]);
      }
      
      view = new View3D(model, canvas);
   }




