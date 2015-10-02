//--------------- просто утилиты -----------------------------------------

function $(id) { return document.getElementById(id); }

//---------------------- модуль Geometry ---------------------------------

var Geometry = (function ()
{
    // ------------- закрытые члены --------------------------------------

        // Расстояние между точками
        function _distance (p1, p2) {
            var dx = p2.x - p1.x, dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // Скалярное произведение векторов
        function _scalar(a, b) //->V
        {
            return a.x * b.x + a.y * b.y;
        }



    // ------------- открытые члены --------------------------------------

        return {
            distance: _distance,

            scalar: _scalar,

            // Расстояние от точки до бесконечной прямой
            //
            distToInfiniteLine: function (p, line) {
                var a = line.A(), b = line.B(), c = line.C();
                return Math.abs(a * p.x + b * p.y + c) /  Math.sqrt(a * a + b * b);
            },


            // Точка пересечения прямой line и перпендикуляра к ней, опущенного из точки p.
            //
            cross: function (p, line) {
                if (line instanceof Link) {
                    line.x1 = line.b1.x;
                    line.y1 = line.b1.y;
                    line.x2 = line.b2.x;
                    line.y2 = line.b2.y;
                }
                var k = line.k();
                var b = line.b();

                // прямая вертикальна
                if (line.x1 == line.x2)
                    return { x: line.x1, y: p.y };
                // прямая горизонтальна
                if (line.y1 == line.y2)
                    return { x: p.x, y: line.y1 };
                // уравнение перпендикуляра, проходящего через точку p: y = k1 * x + b1
                var k1 = -1 / k;
                var b1 = p.y - k1 * p.x;
                // уравнение прямой: y = k2 * x + b2
                var k2 = k;
                var b2 = b;

                // точка пересечения перепендикуляра и прямой.
                return { x: (b1 - b2) / (k2 - k1), y: (k2 * b1 - k1 * b2) / (k2 - k1) };
            },

            // Расстояние от точки до конечного отрезка линии
            //
            cross2: function (b, line, dot) {
                if (line instanceof Link) {
                    line.x1 = line.b1.x;
                    line.y1 = line.b1.y;
                    line.x2 = line.b2.x;
                    line.y2 = line.b2.y;
                    var p1 = { x: line.b1.x, y: line.b1.y };
                    var p2 = { x: line.b2.x, y: line.b2.y };
                } else {
                    var p1 = { x: line.x1, y: line.y1 };
                    var p2 = { x: line.x2, y: line.y2 };
                }

                // точка пересечения лежит в пределах отрезка
                if ((p1.x <= dot.x && dot.x <= p2.x || p2.x <= dot.x && dot.x <= p1.x) && 
                    (p1.y <= dot.y && dot.y <= p2.y || p2.y <= dot.y && dot.y <= p1.y) )
                    return dot;
                // точка пересечения лежит за пределами отрезка
                var dist1 = _distance(b, p1);
                var dist2 = _distance(b, p2);
                if (dist1 < dist2)
                    return dist1 <= b.r ? p1 : null;
                else
                    return dist2 <= b.r ? p2 : null;
            },


            // Экономное определение того, что две точки p1 и p2 ближе, чем d
            //
            closer: function (p1, p2, d) {
                var dx = p2.x - p1.x;
                if (Math.abs(dx) > d)
                    return false;
                var dy = p2.y - p1.y;
                if (Math.abs(dy) > d)
                    return false;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > d)
                    return false;
                return dist;
            },

            // Единичный вектор из p1 в p2
            //
            unit: function (p1, p2)  //->V
            {
                var dx = p2.x - p1.x, dy = p2.y - p1.y;
                var dd = Math.sqrt(dx * dx + dy * dy);
                return { x: dx / dd, y: dy / dd };
            },


            // Модуль проекции  вектора а на вектор b
            //
            proj: function (a, b) //->N
            {
                return _scalar(a, b) / _scalar(b, b);
            },
        };
}());


    // Произведение числа на вектор
    //nv: function (k, v) //->V
    //{
    //    return { x: k * v.x, y: k * v.y };
    //},

    //// Сумма  векторов
    //function sum(v1, v2) //->V
    //{
    //    return { x: v1.x + v2.x, y: v1.y + v2.y };
    //}

    //// Разность  векторов
    //function dif(v1, v2) //->V
    //{
    //    return { x: v1.x - v2.x, y: v1.y - v2.y };
    //}

    //// Модуль вектора
    //function mod(v) //->M
    //{
    //    return Math.sqrt(v.x * v.x + v.y * v.y);
    //}





