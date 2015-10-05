
function Model(width, height) {

    this.METER = 10;
    this.SEC = 100;

    this.chronos = 0;
    this.width = width;
    this.height = height;
    this.debugMode;   // режим отрисовки сил и скоростей шаров и установки часов

    this.balls = [];

    var me = this;

    //-------------------------- Механика ------------------------------------------------

    // Сохраняет измененные параметры
    //
    this.setParams = function (params) {
        if (params.B != undefined) Ball.prototype.BB = Ball.prototype.BL = params.B;
        if (params.Be != undefined) Ball.prototype.BBe = Ball.prototype.BLe = params.Be;

        if (params.G != undefined) Ball.prototype.G = params.G;
        if (params.Air != undefined) Ball.prototype.Air = params.Air;
    }

    // Собирает параметры
    //
    this.getParams = function () {

        return "G: " + Ball.prototype.G +
     ",   Air: " + Ball.prototype.Air;        
    }

    this.step = function () {
        forses();
        for (i in this.balls) {
            this.balls[i].move();
            if (this.chronos % 10 == 0)
                this.balls[i].addPointToTrack();
        }
        this.chronos++;
    }

    // Вычисление суммы приложенных к шарам сил
    //
    function forses() {       
        var n = me.balls.length;

        // Учет постоянных факторов 
        for (var i = 0; i < n; i++) {
            me.balls[i].constFactors();
        }

        // Взаимное притяжение шаров
        for (var i = 0; i < n - 1; i++) {
            var b1 = me.balls[i];
            if (b1.isDead)
                continue;
            for (var j = i + 1; j < n; j++) {
                var b2 = me.balls[j];
                if (b2.isDead)
                    continue;
                b1.mutualGravity(b2);

                // слияние шаров
                if (Geometry.distance(b1, b2) < b1.r + b2.r) {
                    if (b1.m < b2.m) {
                        var t = b1; b1 = b2; b2 = t;
                    }
                    var M = b1.m + b2.m;
                    b1.vx = (b1.vx * b1.m + b2.vx * b2.m) / M;
                    b1.vy = (b1.vy * b1.m + b2.vy * b2.m) / M;
                    b1.m = M;
                    b1.r = Math.pow(Math.pow(b1.r, 3) + Math.pow(b2.r, 3), 1 / 3);
                    b2.m == 0;
                    b2.isDead = true;
                }
            }
        }
    }

    // Удаление дохлых шаров
    // 
    this.removeDeadBalls = function () {
        for (var i = 0; i < this.balls.length; i++) {
            if (this.balls[i].isDead || Math.abs(me.balls[i].x) > this.width * 20 || Math.abs(me.balls[i].y) > this.height * 20) {
                this.balls.splice(i--, 1);
            }
        }
    }

    // Определение центра масс. Возвращает {x, y, m}.
    //
    this.centerOfMass = function() {
        var M = xM = yM = 0;
        for (var i = 0; i < this.balls.length; i++) {
            var b = me.balls[i];
            xM += b.x * b.m;
            yM += b.y * b.m;
            M += b.m;
        }
        if (!M)
            return { x: 0, y: 0, m: 0 };
        return { x: xM / M, y: yM / M, m: M };
    }

    // Определение тангенциальной скорости нового шара относительно центра масс системы
    //
    this.tangVelo = function (b)
    {
        if (!this.balls.length) {
            b.vx = b.vy = 0;
            return;
        }

        var c = this.centerOfMass();

        var dx = b.x - c.x, dy = b.y - c.y;
        var d2 = dx * dx + dy * dy;
        var dist = Math.sqrt(d2);

        // единичный вектор от c к b, повернутый на 90 градусов
        var r = { x: dx / dist, y: dy / dist };
        r = {x: r.y, y: -r.x};

        // скорость
        var v = Math.sqrt(b.G * (b.m + c.m) / dist);

        b.vx -= r.x * v;
        b.vy -= r.y * v;
    }

    // ----------------------------------------------------------------------------------------------

    this.addBall = function (b) {
        this.balls.push(b);
        this.selectedBall = this.balls[this.balls.length - 1];
    }

    this.selectedBall = null;

    this.selectBall = function (p) {
        this.selectedBall = this.ballAtPlace(p);
    }

    this.ballAtPlace = function (p) {
        for (i in this.balls) {
            var b = this.balls[i];
            if (Geometry.distance(p, b) < b.r)
                return b;
        }
        return null;
    }

    this.removeSelectedBall = function () {
        var b = this.selectedBall;
        if (b) {
            // remove a ball
            var i = this.balls.indexOf(b);
            this.balls.splice(i, 1);

            // select the last ball
            if (this.balls.length > 0) 
                this.selectedBall = this.balls[this.balls.length - 1];
        }        
    }


    this.veloAtPlace = function (p, vDraw) {
        for (i in this.balls) {
            var b = this.balls[i];
            var p2 = { x: b.x + b.vx * vDraw, y: b.y + b.vy * vDraw };
            if (Geometry.distance(p, p2) < 2)
                return b;
        }
        return null;
    }

    this.copySelectedBall = function (p) {
        var b = this.selectedBall;
        if (b)
            this.balls.push(new Ball({ x: p.x, y: p.y, vx: 0, vy: 0, r: b.r, color: b.color }));
    }

    // Делает шар, находящийся под курсором, фиксированным или подвижным.
    //
    this.fixBall = function (p) {
        var b = this.ballAtPlace(p);
        if (b) {
            if (b instanceof FBall) {
                // расфиксируем  - делаем красным
                b.__proto__ = Ball.prototype;
                b.color = 'red';
            } else {
                // фиксируем - делаем оранжевым 
                b.__proto__ = FBall.prototype;
                b.color = 'orange';
            }
            b.m = b.massa();
        }
    }

}
