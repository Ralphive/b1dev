var hanaServer;
var connected = false;
var refresh;
var cockpit;
var iframeOk = false;

$(document).ready(function(){  
	// Connect Button (on modal window)
	$("#connect").click(function(){
		if(!connected){
			createIframe();	
		}
	});
	
	//Refresh Button
	$("#Refresh").click(function(){
		if(connected){
			autoRefresh();	
		}
	}); 
	
});


function createIframe(){
	$('#connectModal').modal('hide');
	
	//Initialize Iframe on the Login page (it will redirect to Cockpit)
	hanaServer = document.getElementById("HanaServer");
	refresh = document.getElementById("RefreshTime");
	
	hanaServer = "https://" + hanaServer.value + ":4300" ;
	var loginPage = hanaServer + "/sap/sbo/portal/?site=/sap/sbo/cockpit/";
	cockpit = hanaServer + "/sap/sbo/cockpit/";
	
	$("#cockpitDiv").html("<iframe id='b1Frame' src='"+loginPage+"'></iframe>"); 
	

	refresh = refresh.value * 1000;
	connected = true;
	

}


function autoRefresh()
{	
	if(!iframeOk)
		iframe = changeIframe();
	$("#Refresh").text('Refreshing...');
	refreshPage();
}
function refreshPage() {
	//Refresh every "refresh" seconds
	$('#b1Frame' ).attr( 'src', function ( i, val ) { return val; });
	setTimeout("refreshPage();", refresh);	
}


function changeIframe() {
	
	//Change the iFrame url so it does not refresh on the login page
    var $iframe = $('#b1Frame');   
    
    if ( $iframe.length ) {
        $iframe.attr('src',cockpit);  
        return true;
    }
    return false;
}

