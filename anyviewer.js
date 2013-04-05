// Configuration
tab_info_url = "tabs.json";
move_duration = 2000;

// State variables
tab_counter = 0;
start_next_tab();

// Functions
function start_next_tab() {
	next_tab_info(function(url, seconds) {
		load_tab(url);
		window.setTimeout(start_next_tab, seconds);
	});
}

function load_tab(url) {
	console.log("Load tab: ", url);
}

function next_tab_info(callback) {
	jQuery.ajax({
		url: tab_info_url,
		dataType: 'json'
	}).done(function(data) {
		show_error(data);
	}).fail(function(x, error) {
		show_error("error: " + error + "\n" + JSON.stringify(x));
		window.setTimeout(function() { next_tab_info(callback); }, 1000);
	});
}

function show_error(message) {
	console.log(message);
	$(".errorDlg").text(message).fadeIn();
}
