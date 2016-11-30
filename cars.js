const baseUrl = "http://localhost:9090"
class Car {
    
    constructor(make, model, year, id=-1) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.id = id
        this.repr = [this.id,this.make,this.model,this.year].join("|")
    }
    
    toJSON() {
        return Object.assign({}, this);
    };
    static fromJSON(json) {
    let car = Object.create(Car.prototype);
      return Object.assign(car, json, {repr: [json.id,json.make,json.model,json.year].join("|")});
    }

    display(element){
    	var row = element.tBodies[0].insertRow(-1);
    	row.id = this.id;
		var id = row.insertCell(0);
    	var make = row.insertCell(1);
		var model = row.insertCell(2);
		var year = row.insertCell(3);
		var del = row.insertCell(4);
		id.innerHTML = this.id;
		make.innerHTML = this.make;
		model.innerHTML = this.model;
		year.innerHTML = this.year
		del.innerHTML = `<button onclick=deleteCar(${this.id})>delete</button>`
    }
}

var resultTable = document.getElementById("cars")
function searchCars(key) {
	fetch(`${baseUrl}/cars/?key=${key}`, {
	method: 'get'
	}).then(function(response) {
		return response.json()
	}).then(function(carlist){
	let empty_tbody = document.createElement('tbody');
	resultTable.replaceChild(document.createElement('tbody'),resultTable.tBodies[0])
		console.log(carlist)
		for (var i in carlist) {
			var car = Car.fromJSON(carlist[i]);
	        car.display(resultTable);
	    }	
	}).catch(function(err) {
		console.log(err);
	});
}

function addCar(evt) {
	evt.preventDefault();
	car = new Car(document.forms.add_car.make.value,document.forms.add_car.model.value,parseInt(document.forms.add_car.year.value))
	fetch(`${baseUrl}/cars/`, {
	headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(car.toJSON())
	}).then(function(response) {
		return response.json()
	}).then(function(response){
		console.log(response)
		car.id = response.id
		car.display(resultTable);
	}).catch(function(err) {
		alert(err);
	});
	return false;
}

function removeFromDom(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

function deleteCar(car_id) {
	fetch(`${baseUrl}/cars/${car_id}/`, {
	headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE",
    }).then(function(response){
		removeFromDom(car_id);
		console.log("Delete Successfull !")	
	}).catch(function(err) {
		alert(err);
	});
	return false;
}
