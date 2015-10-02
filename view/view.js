function View3D(model, canvas) {
    var scene = new THREE.Scene();

   // LIGHT
    var light = new THREE.PointLight(0xffffff, 2, 10000);
    light.position.set(0, 0, 0);
    scene.add(light);

    // CAMERA
    camera = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 0.1, 10000);
    camera.position.set(0, 0, 1500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

   // add planets to the sceen
    var textures = [
       THREE.ImageUtils.loadTexture('pic/sun2.jpg'),
       THREE.ImageUtils.loadTexture('pic/earth.jpg'),
       THREE.ImageUtils.loadTexture('pic/earth2.jpg'),
    ];
    for (var i = 0; i < model.balls.length; i++) {
        var b = model.balls[i];
        var sphere_geometry = new THREE.SphereGeometry(b.r, 64, 64);
        var sphere_material = new THREE.MeshPhongMaterial({
           map: textures[i],
           emissive: i==0 ? 0xffffff : 0x101010,  
        });
        b.sphere = new THREE.Mesh(sphere_geometry.clone(), sphere_material);
        b.sphere.position.set(b.x, b.y, 0);
        scene.add(b.sphere);
    }

    var renderer = new THREE.WebGLRenderer({ "canvas": canvas });
    renderer.setSize(canvas.width, canvas.height);

    var show = function () {
       //requestAnimationFrame(show);

       // change scene
        model.step();
        for (var i = 0; i < model.balls.length; i++) {
            var b = model.balls[i];
            b.sphere.position.set(b.x, b.y, 0);
            b.sphere.rotation.z += b.spin;
        }
        
        renderer.render(scene, camera);
    }

    setInterval(show, 10);

}



