

var deDom = document.getElementsByTagName("html");
console.log(deDom);


/*
	Vertaling woord CRUD
*/

//GET		
function getWoordenlijst() {
	return new Promise(function(resolve,reject){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(this.readyState==4){
			var woordenArray = JSON.parse(this.responseText);
			resolve(woordenArray);
		}
	}
	var url = "http://173.212.208.199:8082/lesVertalingen" + sessionStorage.getItem("selectedLesson");
	xhr.open("GET", url , "true");
	xhr.send();
	})
}

function getWoordenlijstForCourseTest(testLengte) {
	return new Promise(function(resolve,reject){
		var xhr = new XMLHttpRequest();
	
		xhr.onreadystatechange = function() {
			if(this.readyState==4){
				var woordenArray = JSON.parse(this.responseText);
				resolve(woordenArray);
			}
		}
		var url = "http://173.212.208.199:8082/testCourse" + testLengte + "in" + sessionStorage.getItem("selectedCourse");
		xhr.open("GET", url , "true");
		xhr.send();
		})
}

function getWoordenlijstForTaalTest(testLengte) {
	return new Promise(function(resolve,reject){
		var xhr = new XMLHttpRequest();
	
		xhr.onreadystatechange = function() {
			if(this.readyState==4){
				var woordenArray = JSON.parse(this.responseText);
				resolve(woordenArray);
			}
		}
		var url = "http://173.212.208.199:8082/testTaal" + testLengte + "in" + sessionStorage.getItem("selectedTaal");
		xhr.open("GET", url , "true");
		xhr.send();
		})
}

async function getWoordenlijstMakeUp() {
	var woordenArray = await getWoordenlijst();
	//console.log(woordenArray[0].primaryLanguage);
	document.getElementById("woordenLijst").innerHTML="";
						
	for(var a=0; a<woordenArray.length; a++) {
		var codeBlock = 	'<tr>' + 
								'<td class="contentColumn" >' + woordenArray[a].primaryLanguage + '</td>' +
								'<td class="contentColumn">' + woordenArray[a].targetLanguage + '</td>' +
								'<td class="buttonColumn" ><input type="button" class="btn btn-outline-secondary" value="delete" onclick="openWindow(deleteWoord,'+woordenArray[a].id+')" class="buttonInTable"></td>' +
								'<td class="buttonColumn" ><input type="button" class="btn btn-outline-secondary" value="change" onclick="getSpecificWoordForChange('+woordenArray[a].id+')" class="buttonInTable"></td>' +
							'</tr>'
		document.getElementById("woordenLijst").innerHTML += codeBlock;
	}
}

function getSpecificWoordForChange(idVertaling) {
	console.log(idVertaling);
	var xhr = new XMLHttpRequest();
	var url = "http://173.212.208.199:8082/G" + idVertaling;
	document.getElementById("changeOpties").style.display = "block";
				
	xhr.onreadystatechange = function() {
		if (this.readyState==4) {
			
			var specificWoord = JSON.parse(this.responseText);

			document.getElementById("woordVerandering").value = specificWoord.primaryLanguage;
			document.getElementById("vertalingVerandering").value = specificWoord.targetLanguage;
            sessionStorage.setItem("changeWoordId", specificWoord.id);
		}
	}
	xhr.open("GET", url, "true");
	xhr.send();			
}

//POST	
function addWoord() {
	var niewWoord = {};
	niewWoord.primaryLanguage = document.getElementById("woord1").value;
	niewWoord.targetLanguage = document.getElementById("woordVertaling").value;
	var nwJSON = JSON.stringify(niewWoord);
				
	var xhr = new XMLHttpRequest();
                
    var url = "http://173.212.208.199:8082/vertalingToevoegen" + sessionStorage.getItem("selectedLesson");
	xhr.open("POST", url, "true");
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(nwJSON);
				
	document.getElementById("woord1").value = "";
	document.getElementById("woordVertaling").value = "";
				
	getWoordenlijstMakeUp();
}

//DELETE
function deleteWoord(idVertaling) {
	console.log(idVertaling);
	var xhr = new XMLHttpRequest();
	var url = "http://173.212.208.199:8082/deleteVertaling" + sessionStorage.getItem("selectedLesson") + "en" + idVertaling;
    //var url = "http://173.212.208.199:8082/D" + idVertaling
    xhr.open("DELETE", url, "true");
	xhr.send();
						
	getWoordenlijstMakeUp();
}  

//PUT
function updateWoord() {
	var veranderdWoord = {};
	veranderdWoord.primaryLanguage = document.getElementById("woordVerandering").value;
	veranderdWoord.targetLanguage =  document.getElementById("vertalingVerandering").value;
	var vwJSON = JSON.stringify(veranderdWoord);
				
	var xhr = new XMLHttpRequest();
	var url = "http://173.212.208.199:8082/C" + sessionStorage.getItem("changeWoordId");
    sessionStorage.removeItem("changeWoordId");
                
	xhr.open("PUT", url, "true");
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(vwJSON);
				
	document.getElementById("woordVerandering").value="";
	document.getElementById("vertalingVerandering").value="";
	document.getElementById("changeOpties").style.display = "none";
				
	getWoordenlijstMakeUp();
}


/*
	Lesson CRUD
*/

//GET
function getLessonList() {
	return new Promise(function(resolve,reject){
		var xhr = new XMLHttpRequest;
		xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				var lessonArray = JSON.parse(this.responseText);
				resolve(lessonArray);
			}
		}
		var url = "http://173.212.208.199:8082/courseLessenLijst" + sessionStorage.getItem("selectedCourse");
		xhr.open("GET", url, "true")
		xhr.send();
	})
}

async function lessonListMakeUp() {
	var lessonArray = await getLessonList();
	document.getElementById("lessenLijst").innerHTML = "";
	for (var a = 0; a<lessonArray.length; a++) {
		placeLessonSelectButton(lessonArray[a].id, lessonArray[a].naam);
	}
}

function getSpecificLes() {
	return new Promise(function(resolve,reject) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				var lessonObject = JSON.parse(this.responseText);
				sessionStorage.setItem("lessonName", lessonObject.naam);
				resolve();
			}
		}
		var url = "http://173.212.208.199:8082/specificLesVars" + sessionStorage.getItem("selectedLesson");
		xhr.open("GET", url, "true")
		xhr.send();
	})
}


//POST
function addLesson() {
    var lesObject = {};
    lesObject.naam = document.getElementById("lessonToevoegen").value;
    document.getElementById("lessonToevoegen").value = "";
    var loJSON = JSON.stringify(lesObject);

	var xhr = new XMLHttpRequest();
	var url = "http://173.212.208.199:8082/lesToevoegen" + sessionStorage.getItem("selectedCourse");
    xhr.open("POST", url, "true");
    xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(loJSON);
	lessonListMakeUp();
}

//DELETE     
function deleteLes() {
    var xhr = new XMLHttpRequest();
    var url = "http://173.212.208.199:8082/deleteLes" + sessionStorage.getItem("selectedLesson") + "binnen" + sessionStorage.getItem("selectedCourse");

    xhr.open("DELETE", url, "true");
	xhr.send()
	
    sessionStorage.removeItem("selectedLesson");
    window.open("LesPagina.html", "_parent")
}

//PUT
function changeLessonName(newValue) {
	var url = "http://173.212.208.199:8082/changeLessonName" +newValue+"in"+sessionStorage.getItem("selectedLesson");
	console.log(newValue);
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", url, "true");
	xhr.send();
}

/* 
	Course CRUD
*/

//GET
function getCourseList() {
		var xhr = new XMLHttpRequest;
		xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				document.getElementById("courseListBlock").innerHTML = "";
				var courseArray = JSON.parse(this.responseText);
				for (var a = 0; a<courseArray.length; a++) {
					placeCourseSelectButton(courseArray[a].id, courseArray[a].naam);
				}
			}
		}
		var url="http://173.212.208.199:8082/taalCoursesLijst" + sessionStorage.getItem("selectedTaal")
		xhr.open("GET", url, "true")
		xhr.send();
}

function getSpecificCourse() {
	return new Promise(function(resolve,reject) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				var courseObject = JSON.parse(this.responseText);
				sessionStorage.setItem("courseName", courseObject.naam);
				resolve();
			}
		}
		var url = "http://173.212.208.199:8082/specificCourseVars" + sessionStorage.getItem("selectedCourse");
		xhr.open("GET", url, "true")
		xhr.send();
	})
}


//POST
function addCourse() {
	return new Promise(function(resolve,reject){
		var courseObject = {};
		courseObject.naam = document.getElementById("newCourseName").value;
		document.getElementById("newCourseName").value = "";
		var coJSON = JSON.stringify(courseObject);

		var xhr = new XMLHttpRequest();
		var url = "http://173.212.208.199:8082/courseToevoegen" + sessionStorage.getItem("selectedTaal")
		xhr.open("POST", url, "true");
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(coJSON);
		getCourseList();
		resolve();
	})
	//still needs to build in a way to wait for this function to finish.
	//It can't await gercourse list because this finishes fine. It is server side ms delay before the addition/change is saved.
}

//DELETE     
function deleteCourse() {
    var xhr = new XMLHttpRequest();
    var url = "http://173.212.208.199:8082/deleteCourse" + sessionStorage.getItem("selectedCourse");

    xhr.open("DELETE", url, "true");
    xhr.send()

    sessionStorage.removeItem("selectedCourse");
    window.open("CoursePagina.html", "_parent")
}

//PUT
function changeCourseName(newValue) {
	var url = "http://173.212.208.199:8082/changeCourseName" +newValue+"in"+sessionStorage.getItem("selectedCourse");
	console.log(newValue);
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", url, "true");
	xhr.send();
}

/*
	Taal CRUD
*/

//GET
function getTaalList() {
	var xhr = new XMLHttpRequest;
	xhr.onreadystatechange = function() {
		if (this.readyState==4) {
			document.getElementById("taalSelectBlock").innerHTML = "";
			var taalArray = JSON.parse(this.responseText);
			for (var a = 0; a<taalArray.length; a++) {
				placeTaalSelectButton(taalArray[a].id, taalArray[a].naam);
			}
		}
	}
	xhr.open("GET", "http://173.212.208.199:8082/taalLijst", "true")
	xhr.send();
}

function getSpecificTaal() {
	return new Promise(function(resolve,reject) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				var taalObject = JSON.parse(this.responseText);
				sessionStorage.setItem("taalName", taalObject.naam);
				resolve();
			}
		}
		var url = "http://173.212.208.199:8082/specificTaalVars" + sessionStorage.getItem("selectedTaal");
		xhr.open("GET", url, "true")
		xhr.send();
	})
}

//POST
function addTaal() {
    var taalObject = {};
    taalObject.naam = document.getElementById("taalToevoegen").value;
    document.getElementById("taalToevoegen").value = "";
    var toJSON = JSON.stringify(taalObject);

	var xhr = new XMLHttpRequest();
	var url = "http://173.212.208.199:8082/taalMaken";
    xhr.open("POST", url, "true");
    xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(toJSON);
	getTaalList();
}

//DELETE     
function deleteTaal() {
    var xhr = new XMLHttpRequest();
    var url = "http://173.212.208.199:8082/deleteTaal" + sessionStorage.getItem("selectedTaal");

    xhr.open("DELETE", url, "true");
    xhr.send()

	sessionStorage.removeItem("selectedSession");
	
    window.open("TaalPagina.html", "_parent")
}

//PUT
function changeTaalName(newValue) {
	var url = "http://173.212.208.199:8082/changeTaalName" +newValue+"in"+sessionStorage.getItem("selectedTaal");
	console.log(newValue);
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", url, "true");
	xhr.send();
}


/*
	Lesson, Course selection button function
*/
function placeLessonSelectButton(id, naam) {
	var lessonButton = document.createElement("button");
    lessonButton.id = id;
	lessonButton.innerHTML = naam;
	lessonButton.className="selectorButton btn btn-outline-dark";;
    lessonButton.onclick = function() {
		sessionStorage.setItem("selectedLesson", id);
    	window.open("LesInhoud.html", "_parent")
    }
    lessenLijst.appendChild(lessonButton);
}

function placeCourseSelectButton(id, naam) {
	var courseButton = document.createElement("button");
	courseButton.id = id;
	courseButton.innerHTML = naam;
	courseButton.className="selectorButton btn btn-outline-dark";
	courseButton.onclick = function(){
		sessionStorage.setItem("selectedCourse", id);
		window.open("LesPagina.html", "_parent")
	}
	courseListBlock.appendChild(courseButton);
}

function placeTaalSelectButton(id, naam) {
	var taalButton = document.createElement("button");
	taalButton.id = id;
	taalButton.innerHTML = naam;
	taalButton.className="selectorButton btn btn-outline-dark";;
	taalButton.onclick = function(){
		sessionStorage.setItem("selectedTaal", id);
		window.open("CoursePagina.html", "_parent")
	}
	taalSelectBlock.appendChild(taalButton);
}


/*
	Delete pop-Up window functions
*/
function closeWindow() {
	document.getElementById("deletePopUp").style.display = "none";
}

function confirmDeletion(id, deleteFunction) {
	document.getElementById("confirm").onclick = deleteFunction(id);
}
			
function openWindow(deleteFunction, optionalIdWoord) {
	placePopUpButton(deleteFunction, optionalIdWoord);
	document.getElementById("deletePopUp").style.display = "block";
}

function placePopUpButton(deleteFunction, optionalIdWoord) {
    confirmerButton.onclick = function() {
        deleteFunction(optionalIdWoord);
	    closeWindow();
    }
}

/*
	Testing and Lesson Functionality
*/

async function leerLijst() {
	document.getElementById("SelectedWords").innerHTML = "";
	for(var a=0;a<woordenArray.length & a<10;a++) {
		document.getElementById("SelectedWords").innerHTML += woordenArray[a].primaryLanguage + "&nbsp;".repeat(16) + woordenArray[a].targetLanguage + "<br>";
	}
}

async function leerLijstOefenen(a) {
            
	if(a<woordenArray.length) {
		document.getElementById("beginWoordMakeUp").innerHTML = woordenArray[a].primaryLanguage;
		document.getElementById("vertalingMakeUp").innerHTML = woordenArray[a].targetLanguage;
	} else {
		document.getElementById("beginWoordMakeUp").innerHTML = "Done";
		document.getElementById("vertalingMakeUp").innerHTML = "";
		document.getElementById("vertalingButton").style.display="none";

	}
	document.getElementById("vertaling").style.display= "none";
	document.getElementById("checkingButtons").style.display= "none";
	document.getElementById("vertalingButton").style.display="block";
	document.getElementById("buttonBlock").style.textAlign="center";
}

function showTranslation() {
	document.getElementById("vertaling").style.display= "block";
	document.getElementById("checkingButtons").style.display= "block";
	document.getElementById("vertalingButton").style.display="none";

}

function goNext() {
	var nextLocation = parseInt(sessionStorage.getItem("testLocation")) + 1;
	sessionStorage.setItem("testLocation", (nextLocation));
	
	console.log(nextLocation);
	console.log(sessionStorage.getItem("testLocation"));
	leerLijstOefenen(sessionStorage.getItem("testLocation"));
}

function foutVertaald() {

	//nextlocation +1 tot length of woordenArray moet woord terugkomen
	//wat hier eerst stond zal worden gepushed naar einde
	


	console.log(woordenArray[2].primaryLanguage)
	
	var mistakeNewLocation = getRandomLocationMistake();
	if (mistakeNewLocation < (woordenArray.length)) {
		//needs to replace and push
		console.log(woordenArray[mistakeNewLocation]);
		var pushableWoordObject = woordenArray[mistakeNewLocation];
		woordenArray[mistakeNewLocation] = woordenArray[sessionStorage.getItem("testLocation")];
		woordenArray.push(pushableWoordObject);
	} else {
		//just push
		console.log(mistakeNewLocation);
		console.log("high")
		woordenArray.push(woordenArray[parseInt(sessionStorage.getItem("testLocation"))]);
		console.log(woordenArray[4].primaryLanguage);
	}
	leerLijst();
	goNext();
}

function getRandomLocationMistake() {
	var min = parseInt(sessionStorage.getItem("testLocation"));
	var max = woordenArray.length;
	console.log("min " + min);
	console.log("max " + max);
	if (min<max) {
		var min = min + 2;
		var testMax = max-min;
		var randomLocationZone = Math.floor(Math.random()*Math.floor(testMax));
		var randomLocation = randomLocationZone+min;
	} else {
		var randomLocation = min + 1;
	}//as random upper value is not taken into account this already converts the values to array locations.
	return randomLocation;
}

/*
	Page links
*/

function taalSelectionPage() {
	window.open("TaalPagina.html", "_parent")
}

function courseSelectionPage() {
	window.open("CoursePagina.html", "_parent");
}

function lessonSelectionPage() {
	window.open("LesPagina.html", "_parent");
}

function woordenLijstPage() {
	window.open("LesInhoud.html", "_parent");
}