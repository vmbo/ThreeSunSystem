//function $(id) { return document.getElementById(id); }

window.addEventListener("load", function () {

   var angleRange = document.getElementById("angleRange");
   var distRange = document.getElementById("distRange");
   var graviRange = document.getElementById("graviRange");

   angleRange.oninput = changeCamera;
   distRange.oninput = changeCamera;

   function changeCamera() {
      var angle = angleRange.value * Math.PI / 180;
      var distance = distRange.value;

      var y = distance * Math.cos(angle);
      var z = distance * Math.sin(angle);
      camera.position.set(0, y, z);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
   }


   graviRange.oninput = function () {
      Ball.prototype.G = graviRange.value;
   }


});