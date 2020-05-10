function getWoordenlijst() {
	return new Promise(function(resolve,reject){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(this.readyState==4){
			var woordenArray = JSON.parse(this.responseText);
			resolve(woordenArray);
		}
	}
	var url = "http://173.212.208.199:8082/woorden";
	xhr.open("GET", url , "true");
	xhr.send();
	})
}