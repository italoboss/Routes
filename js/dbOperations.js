var pg = require('pg');
var format = require('pg-format');
var dbName = "routesDB";
var dbUser = "postgres";
var dbPass = "1234";
var dbHost = "localhost";
var dbPort = "5432";
var herokuDB = "postgres://zajznmjxbomzkp:35ad65d4aaafd82b2f11534c6c3798e164310c29471a231c5227920f0b18289b@ec2-23-23-248-162.compute-1.amazonaws.com:5432/d6nsf8mhnqgbje";
//var conString = process.env.DATABASE_URL || "pg://"+dbUser+":"+dbPass+"@"+dbHost+":"+dbPort+"/"+dbName;
var conString = process.env.DATABASE_URL || herokuDB;

// FUNCOES DE OPERACOES COM O BANCO DE DADOS
module.exports = {
    /*
     * Funcao para validar um usuario cadastrado atraves dos campos 'login' e 'password'.
     */
    validateUser: function(req, res) {
        var user = req.body;
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("SELECT * FROM users WHERE login = $1", [user.login]);
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            client.end();
            if (result.rows.length <= 0) {
                req.session.user = null;
                res.write("User doesn't exist!");
                res.end();
            }
            else {
                var aux = result.rows[0];
                if (aux.password == user.password) {
                    req.session.user = aux;
                    res.write('Success');
                    res.end();
                }
                else {
                    req.session.user = null;
                    res.write("Wrong password!");
                    res.end();
                }
            }
        });
    },

    /*
     * Funcao para obter as rotas cadastradas associadas ao usuario.
     */
    getRoutes: function(req, res) {
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("SELECT * FROM routes WHERE user_id = $1", [req.session.user.id]);
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            client.end();
            res.writeHead(200, {'Content-Type': 'text/plain'});
            // console.log(result.rows);
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
            res.end();
        });
    },

    /*
     * Funcao para obter as paradas cadastradas associadas a rota.
     */
    getStopsOfRoute: function(req, res) {
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("SELECT * FROM stops WHERE route_id = $1", [req.query.id]);
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            client.end();
            res.writeHead(200, {'Content-Type': 'text/plain'});
            // console.log(result.rows);
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
            res.end();
        });
    },

    /*
     * Funcao para adicionar uma nova rota, associando-a ao usuario logado.
     */
    addRoute: function(req, res) {
        var newRoute = req.body;
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("INSERT INTO routes (user_id, name, vehicle_id, path) VALUES ($1, $2, $3, $4) RETURNING id",
                    [
                      req.session.user.id,
                      newRoute.name,
                      newRoute.vehicle_id,
                      newRoute.path
                    ]);
        query.on('row', function(row, result) {
          result.addRow(row);
        });
        query.on("end", function (result) {
            var stopsArr = [];
            newRoute.stops.forEach(function(item) {
              item.route_id = result.rows[0].id;
              stopsArr.push([
                item.name, item.lat, item.lng, result.rows[0].id
              ]);
            });
            console.log("------------");
            console.log(stopsArr);
            console.log("------------");
            var sql = format("INSERT INTO stops (name, lat, lng, route_id) VALUES %L ", stopsArr);
            console.log(sql);
            console.log("------------");
            var seqQuery = client.query(sql);
            seqQuery.on("end", function (result) {
                client.end();
                res.write('Success');
                res.end();
            });
        });
    },

    /*
     * Funcao para deletar uma rota associanda ao usuario logado.
     */
    delRoute: function(req, res) {
      console.log("Deleting route...");
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query("DELETE FROM routes WHERE id = $1", [req.query.id]);
        query.on("end", function (result) {
            client.end();
            res.write('Success');
            res.end();
        });
    }
};
