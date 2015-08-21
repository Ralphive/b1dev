var connected = false;
var SessionID;
var SLServer;


$(document).ready(function(){  
	// Connect Button (on modal window)

	$("#connectSL").click(function(){
		hideAlerts();
		connectSL();
	});

	$("button").click(function(){
		if(!connected){
			$('#notConnectedError').modal('show');
			return;
		}
		hideAlerts();

		switch(this.id) {

		case "postBP":
			postBP();
			break;
		case "getBP":
			getBP(false);
			break;
		case "postItem":
			postItem();
			break;
		case "getItem":
			getItem(false);
			break;       
        }
    });

	$("#getBPList").click(function(){
		if(!connected){
			$('#notConnectedError').modal('show');
			return;
		}
		hideAlerts();
		getBP(true);
	});

	$("#getItemList").click(function(){
		if(!connected){
			$('#notConnectedError').modal('show');
			return;
		}	
		hideAlerts();
		getItem(true);
	});

	$("#getOrdersList").click(function(){
		if(!connected){
			$('#notConnectedError').modal('show');
			return;
		}
		hideAlerts();
		getOrders();
	});

	//Erases Result Modal Content
	$('#resulModal').on('hidden.bs.modal', function () {
		$('#resultTable').find("tr").remove();
		$('.jsonResult').empty();
	});

	//Hide Alerts
	$("#okAlert").hide();
	$("#errorAlert").hide();
});


function connectSL(){
	if(connected){
		return;
	}

	var serv = document.getElementById("HanaServer");
	var user = document.getElementById("UserName");
	var pass = document.getElementById("Password");
	var comp = document.getElementById("CompanyDB");

	loadSLServer(serv.value);
	var jData =  JSON.stringify({UserName: user.value, Password: pass.value, CompanyDB: comp.value});	

	$.ajax({
		// the URL for the request
		url: SLServer+"Login",

        xhrFields: {
            withCredentials: true
        },
            
		// the data to send (will be converted to a query string)

		data: jData,

		// whether this is a POST or GET request
		type: "POST",

		// the type of data we expect back
		dataType : "json",

		// code to run if the request succeeds;
		// the response is passed to the function
		success: function( json ) {
			//SessionID = 
			//alert("Session ID - "+ json.SessionId);
			connected = true;
			$('#connectedAlert').modal('show');
			$('#connectModal').modal('hide');

		},

		// code to run if the request fails; the raw request and
		// status codes are passed to the function
		error: function( xhr, status, errorThrown ) {
			$('#connectedError').modal('show');
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
			connected = false;
		},

		// code to run regardless of success or failure
		complete: function( xhr, status ) {
			//alert(complete);
			// Nothing for now.
		}
	});

}


function postBP() {
	var code = document.getElementById("CardCode");
	var name = document.getElementById("CardName");
	var type = $( "#CardType option:selected" ).text();
	type = type.substring(0,1);

	var jData =  JSON.stringify({CardCode: code.value, CardName: name.value, CardType: type});

	//alert(jData);

	$.ajax({
		url: SLServer+"BusinessPartners",		
		xhrFields: {
            withCredentials: true
        },
        data: jData,
		type: "POST",
		dataType : "json",
		success: function( json ) {
			$("#okAlert").fadeIn();
		},
		error: function( xhr, status, errorThrown ) {
			$("#errorAlert").fadeIn();
		},
	});
}

function postItem() {
	var code = document.getElementById("ItemCode");
	var name = document.getElementById("ItemName");

	var jData =  JSON.stringify({ItemCode: code.value, ItemName: name.value});

	//alert(jData);

	$.ajax({
		url: SLServer+"Items",		
		xhrFields: {
            withCredentials: true
        },
        data: jData,
		type: "POST",
		dataType : "json",
		success: function( json ) {
			$("#okAlert").fadeIn();
		},
		error: function( xhr, status, errorThrown ) {
			$("#errorAlert").fadeIn();
		},
	});
}

function getBP(list){
	var filter = "";

	if(!list){
		var CardCode = document.getElementById("CardCode");
		filter = "('"+CardCode.value+"')";
	}
	
	$.ajax({
		url: SLServer + "BusinessPartners" + filter,		
		xhrFields: {
            withCredentials: true
        },
		type: "GET",
		dataType : "json",
		success: function( json ) {
			displayBP(json,list);
		},
		error: function( xhr, status, errorThrown ) {
			$("#errorAlert").fadeIn();
		},
	});
}

function getItem(list){
	var filter = "";

	if(!list){
		var ItemCode = document.getElementById("ItemCode");
		filter = "('"+ItemCode.value+"')";
	}

	$.ajax({
		url: SLServer + "Items" + filter,		
		xhrFields: {
            withCredentials: true
        },
		type: "GET",
		dataType : "json",
		success: function( json ) {
			displayItem(json,list);
		},
		error: function( xhr, status, errorThrown ) {
			$("#errorAlert").fadeIn();
		},
	});
}

function getOrders(){

	$.ajax({
		url: SLServer + "Orders",		
		xhrFields: {
            withCredentials: true
        },
		type: "GET",
		dataType : "json",
		success: function( json ) {
			displayOrders(json);
		},
		error: function( xhr, status, errorThrown ) {
			$("#errorAlert").fadeIn();
		},
	});
	
	//$.get( SLServer + "Orders", function() {

	//})
	//.done(function(json) {
	//	displayOrders(json);
	//})

	//.fail(function() {
	//	$("#errorAlert").fadeIn();
	//})
	//.always(function() {
	//	//alert( "finished" );
	//});

}

function displayBP(json, isList){
	var x = json.value;

//	alert(JSON.stringify(json));

	//Header
	$("#resultTable thead").append(
			"<tr>"	+
			"<th>#</th>"	+
			"<th>Code</th>" +
			"<th>Name</th>" +
			"<th>Type</th>"+
			"<th>Balance</th>"+
	"</tr>");

	if(isList){
		//Lines	
		for (var i=0;i<x.length;i++){
			$("#resultTable tbody").append(
					"<tr>"+
					"<td>"+(i+1)+"</td>"+
					"<td>"+json.value[i].CardCode+"</td>"+
					"<td>"+json.value[i].CardName+"</td>"+
					"<td>"+json.value[i].CardType+"</td>"+
					"<td>"+json.value[i].CurrentAccountBalance+"</td>"+
			"</tr>");
		}	
	}
	else{
		$("#resultTable tbody").append(
				"<tr>"+
				"<td>"+1+"</td>"+
				"<td>"+json.CardCode+"</td>"+
				"<td>"+json.CardName+"</td>"+
				"<td>"+json.CardType+"</td>"+
				"<td>"+json.CurrentAccountBalance+"</td>"+
		"</tr>");

	}
	displayJson(json);
}

function displayItem(json, isList){
	var x = json.value;

//	alert(JSON.stringify(json));

	//Header
	$("#resultTable thead").append(
			"<tr>"	+
			"<th>#</th>"	+
			"<th>Code</th>" +
			"<th>Name</th>" +
			"<th>Qty Stock</th>"+
	"</tr>");

	if(isList){
		//Lines	
		for (var i=0;i<x.length;i++){
			$("#resultTable tbody").append(
					"<tr>"+
					"<td>"+(i+1)+"</td>"+
					"<td>"+json.value[i].ItemCode+"</td>"+
					"<td>"+json.value[i].ItemName+"</td>"+
					"<td>"+json.value[i].QuantityOnStock+"</td>"+
			"</tr>");
		}	
	}
	else{
		$("#resultTable tbody").append(
				"<tr>"+
				"<td>"+1+"</td>"+
				"<td>"+json.ItemCode+"</td>"+
				"<td>"+json.ItemName+"</td>"+
				"<td>"+json.QuantityOnStock+"</td>"+
		"</tr>");

	}
	displayJson(json);
}

function displayOrders(json){
	var x = json.value;

//	alert(JSON.stringify(json));

	//Header
	$("#resultTable thead").append(
			"<tr>"	+
			"<th>#</th>"	+
			"<th>Customer</th>" +
			"<th>Currency</th>"+
			"<th>Deliver</th>"+
			"<th>Total</th>"+

	"</tr>");

	//Lines	
	for (var i=0;i<x.length;i++){
		$("#resultTable tbody").append(
				"<tr>"+
				"<td>"+json.value[i].DocEntry+"</td>"+
				"<td>"+json.value[i].CardCode+"</td>"+
				"<td>"+json.value[i].DocCurrency+"</td>"+
				"<td>"+json.value[i].DocDueDate+"</td>"+
				"<td>"+json.value[i].DocTotal+"</td>"+

		"</tr>");
	}
	displayJson(json);
}

function displayJson(json){

	$("pre").append("<teste>"+
			JSON.stringify(json, null, 4)) + "</teste>";	
	$('#resulModal').modal('show');
}

function hideAlerts(){

	$("#okAlert").fadeOut();
	$("#errorAlert").fadeOut();
}

function loadSLServer(inputServer){

	if (inputServer.length-1 ==  inputServer.lastIndexOf("/")){
		SLServer = inputServer;
	}
	else{
		SLServer = inputServer +"/";
	}	
}
