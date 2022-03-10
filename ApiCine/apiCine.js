"use strict";
exports.__esModule = true;
var bodyparser = require("body-parser");
var mysql = require('mysql');
var pool = mysql.createPool({
    poolLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'TomSoyer5',
    database: 'hoyts'
});
var cluster = require('cluster');
if (cluster.isWorker) {
    process.on('message', function (msg) {
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (msg == "funciones") {
                    if (err)
                        throw err;
                    con.query("SELECT id, titulo, img FROM funciones WHERE vigente = 1 AND fecha > NOW() FOR UPDATE", function (err, result, fields) {
                        if (err) {
                            return con.rollback(function () {
                                throw err;
                            });
                        }
                        con.release();
                        process.send(result);
                        process.kill(process.pid);
                    });
                }
                else if (msg[0] == 'reservar') {
                    con.query("select * from funciones where vigente = 1 and fecha > now() and id = " + msg[1] + " for update", function (err, result, fields) {
                        if (err)
                            throw err;
                        if (result[0] == null) {
                            con.release();
                            process.send("La funcion que quiere reservar no existe");
                            process.kill(process.pid);
                        }
                        var butacas = JSON.parse(result[0].butacas_disponibles);
                        con.query("select * from reservas where usuario = " + msg[3], function (err, result, fields) {
                            if (err)
                                throw err;
                            var funciones = new Array();
                            result.forEach(function (x) {
                                funciones.push(x.funcion);
                            });
                            if (funciones.includes(parseInt(msg[1]))) {
                                con.release();
                                process.send("Ya sacaste entradas para esta funcion");
                                process.kill(process.pid);
                            }
                            if (butacas.length < msg[2].length || msg[2].length > 6) {
                                con.release();
                                process.send("No hay butacas suficientes");
                                process.kill(process.pid);
                            }
                            var arrayButacasR = new Array();
                            for (var i = 0; i < butacas.length; i++) {
                                for (var j = 0; j < msg[2].length; j++) {
                                    if (butacas[i] == msg[2][j]) {
                                        arrayButacasR.push(msg[2][j]);
                                    }
                                }
                            }
                            butacas = butacas.filter(function (ele) {
                                if (!arrayButacasR.includes(ele)) {
                                    return ele;
                                }
                            });
                            butacas = JSON.stringify(butacas);
                            var stringButacasR = JSON.stringify(arrayButacasR);
                            con.query("insert into reservas values(null," + msg[3] + "," + msg[1] + ", '" + stringButacasR + "')", function (err, result, fields) {
                                if (err)
                                    throw err;
                                con.query("update funciones set butacas_disponibles = '" + butacas + "' where id= " + msg[1], function (err, result, fields) {
                                    if (err)
                                        throw err;
                                    if (butacas.length == 0) {
                                        con.query("update funciones set vigente = 0 and butacas_disponibles = [] where id= " + msg[1], function (err, result, fields) {
                                            if (err)
                                                throw err;
                                        });
                                    }
                                    con.commit(function (err) {
                                        if (err) {
                                            return con.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        con.release();
                                        console.log(stringButacasR);
                                        console.log("Se reservo correctamente");
                                        process.send(result);
                                        process.kill(process.pid);
                                    });
                                });
                            });
                        });
                    });
                }
                else if (msg[0] == 'butacas') {
                    if (err)
                        throw err;
                    con.query("SELECT butacas FROM salas inner join funciones on salas.id=funciones.sala where funciones.id =" + msg[1] + " FOR UPDATE", function (err, result, fields) {
                        if (err)
                            throw err;
                        con.query("SELECT butacas_disponibles FROM funciones WHERE id =" + msg[1] + " FOR UPDATE", function (err, result1, fields) {
                            if (err)
                                throw err;
                            con.query("SELECT img, titulo FROM funciones WHERE id =" + msg[1] + " FOR UPDATE", function (err, result2, fields) {
                                if (err) {
                                    return con.rollback(function () {
                                        throw err;
                                    });
                                }
                                con.release();
                                var results = [];
                                results.push(result1);
                                results.push(result);
                                results.push(result2);
                                process.send(results);
                                process.kill(process.pid);
                            });
                        });
                    });
                }
                else if (msg[0] == 'cancelar') {
                    if (err)
                        throw err;
                    con.query("START TRANSACTION;", function (err, result, fields) {
                        if (err) {
                            return con.rollback(function () {
                                throw err;
                            });
                        }
                        con.query("UPDATE funciones INNER JOIN reservas ON reservas.funcion = funciones.id SET funciones.butacas_disponibles = CONCAT( SUBSTRING( funciones.butacas_disponibles, 1, LENGTH( funciones.butacas_disponibles ) -1 ), ',', SUBSTRING( reservas.butacas_reservadas, 2 ) ) WHERE reservas.usuario=" + msg[1] + " AND reservas.funcion = " + msg[2] + " AND TIMESTAMPDIFF(HOUR, NOW(), funciones.fecha) > 1", function (err, result, fields) {
                            if (err) {
                                return con.rollback(function () {
                                    throw err;
                                });
                            }
                            var resultado = result;
                            con.query("DELETE reservas FROM reservas INNER JOIN funciones ON funciones.id = reservas.funcion WHERE reservas.usuario = " + msg[1] + " AND reservas.funcion = " + msg[2] + " AND TIMESTAMPDIFF(HOUR, NOW(), funciones.fecha) > 1;", function (err, result, fields) {
                                if (err) {
                                    return con.rollback(function () {
                                        throw err;
                                    });
                                }
                                con.query("COMMIT;", function (err, result, fields) {
                                    if (err) {
                                        return con.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    if (resultado.affectedRows > 0) {
                                        console.log("Su reserva fue borrada con exito");
                                    }
                                    else {
                                        console.log("El tiempo para cancelar la reserva expiro");
                                    }
                                    con.release();
                                    process.send(resultado);
                                    process.kill(process.pid);
                                });
                            });
                        });
                    });
                }
            });
        });
    });
}
else {
    var cors = require('cors');
    var express_1 = require('express');
    var app = express_1();
    var port_1 = 3000;
    app.use(cors());
    app.listen(port_1, function () {
        console.log("Se levanto el server en http://localhost:".concat(port_1));
    });
    // Configuro algunas cosas del servidor
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.get('/', function (req, res) {
        res.send('prende eso?');
    });
    app.get('/funciones', function (req, res) {
        var worker = cluster.fork();
        worker.send('funciones');
        worker.on('message', function (result) {
            res.status(200).send(result);
        });
    });
    app.get('/butacas/:id', function (req, res) {
        var id = req.param('id');
        var msg = new Array;
        msg.push('butacas');
        msg.push(id);
        var worker = cluster.fork();
        worker.send(msg);
        worker.on('message', function (result) {
            res.status(200).send(result);
        });
    });
    app.post('/:id_funcion/reservar', function (req, res) {
        var idF = req.param('id_funcion');
        var butacasreservar = req.body.butacas;
        var idUser = req.body.usuario;
        var msg = new Array;
        msg.push('reservar');
        msg.push(idF);
        msg.push(butacasreservar);
        msg.push(idUser);
        var worker = cluster.fork();
        worker.send(msg);
        worker.on('message', function (result) {
            res.status(200).send(result);
        });
    });
    app.post('/:id_funcion/cancelar_reserva', function (req, res) {
        var user = req.body.user;
        var idF = Number(req.params.id_funcion);
        var data = new Array;
        data.push('cancelar');
        data.push(user);
        data.push(idF);
        var worker = cluster.fork();
        worker.send(data);
        worker.on('message', function (result) {
            res.status(200).send(result);
        });
    });
}
