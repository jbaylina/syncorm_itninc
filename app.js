/*jslint node: true */
"use strict";

var Database = require('syncorm').Database;
var _=require('underscore');

var db = new Database({
    driver: "mysql",
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'syncorm_itnic',
    log: true
});

db.define({
    name: "Person",
    table: "persons",
    id: "idperson",
    fields: {
        idperson: {
			type: "integer",
			def: function() {
				return db.sequences.idperson.inc();
			}
        },
        firstname: "string",
        lastname: "string",
        birthdate: "date"
    },
    calculatedFields: {
        age: function() {
            var today = new Date();
            var birthDate = new Date(this.birthdate);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
            {
                age--;
            }
            return age;
        }
    },
});


db.define({
    name: "Sequence",
    table: "sequences",
    id: "name",
    fields: {
        name: "string",
        last: "integer"
    },
    methods: {
        inc: function () {
            this.last += 1;
            return this.last;
        }
    }
});


db.define({
    name: "Measure",
    table: "measures",
    id: "idmeasure",
    fields: {
        idmeasure: {
            type: "integer",
            def: function () {
                return db.sequences.idmeasure.inc();
            }
        },
        idperson: "integer",
        timestamp: "datetime",
        height: "float",
        parameters: "json"
    },
    relations: {
        person: {
            type: "Person",
            link: ["idperson"],
            reverse: "measures",
            reverseVisibility: ["PUBLIC"]
        }
    }
});

db.loadAll(function() {
	console.log("Database is loaded");
	console.log("My name is "+ db.persons[1].firstname + " " + db.persons[1].lastname);

	_.each(db.persons, function(p) {
		console.log(p.firstname + " " + p.lastname + " " + p.age);
		_.each(p.measures, function(m) {
			console.log(" * " + m.height);
		});
		console.log("");
	});

/*	db.doTransaction(function() {
		var p = new db.Person({firstname: "Joan", lastname: "Snith"});
	},function(err) {
		if(err) {
			console.log(err.stack);
			return;
		}
	}); */
});


