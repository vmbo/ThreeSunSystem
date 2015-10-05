function Ball(b) {
    if (!b)
        return;
    this.x = b.x;
    this.y = b.y;
    this.vx = b.vx;
    this.vy = b.vy;
    this.r = b.r;
    this.spin = b.spin;

    this.m = b.m ? b.m : this.massa();
    this.fx = 0;
    this.fy = 0;
    this.track = [];

}

Ball.prototype.massa = function () { return Math.pow(this.r, 3); }


Ball.prototype.G = 0.1; // постоянная гравитации
Ball.prototype.Air = 0;  // постоянное сопротивление среды (0.0001)


// Учет сопротивления среды
//
Ball.prototype.constFactors = function () {
    var b = this;
    b.fx = b.fy = 0;

    // рассеяние энергии в среде 
    if (this.Air) {
        b.fx -= b.vx * this.Air * b.r;
        b.fy -= b.vy * this.Air * b.r;
    }

}


// Притяжение шара к шару          
//
Ball.prototype.mutualGravity = function (b2) {
    var b1 = this;

    var dx = b2.x - b1.x, dy = b2.y - b1.y;
    var d2 = dx * dx + dy * dy;
    var dist = Math.sqrt(d2);
    
    // единичный вектор от b1 к b2
    var r = { x: dx / dist, y: dy / dist };

    // модуль реакции
    var mr = -this.G * b1.m * b2.m / d2;

    b1.fx -= r.x * mr;
    b1.fy -= r.y * mr;

    b2.fx += r.x * mr;
    b2.fy += r.y * mr;    
}

// Перемещение шара под действием сил
//
Ball.prototype.move = function ()
{
    var b = this;

    var ax = b.fx / b.m;
    var ay = b.fy / b.m;

    b.vx += ax;
    b.vy += ay;

    b.x += b.vx;
    b.y += b.vy;
}

// Траектория - хвост за шаром 
//
Ball.prototype.addPointToTrack = function() {
   this.track.push(new THREE.Vector3(this.x, this.y, 0));
   if (this.trackLength === undefined && Math.abs(this.track[0].x - this.x) < 10 && Math.abs(this.track[0].y - this.y) < 10 && this.track.length > 10)
      this.trackLength = this.track.length + 1;
 
   if (this.trackLength !== undefined && this.track.length > this.trackLength)
        this.track.splice(0, 1);
}