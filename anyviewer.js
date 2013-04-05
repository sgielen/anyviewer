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
		window.setTimeout(start_next_tab, seconds * 1000);
	});
}

function load_tab(url) {
	$("#loading").hide();
	$("#errorDlg").fadeOut();
	iframe = $("<iframe>").toggleClass("right");
	iframe.css("width", $(window).width());
	iframe.css("height", $(window).height());
	iframe.css("left", $(window).width());
	iframe.attr("src", url);
	$("body").append(iframe);
	iframe.load(function() {
		oldiframe = $("iframe.left");
		oldiframe.animate({
			left: -$(window).width()
		}, {
			duration: move_duration,
			queue: false,
			complete: function() {
				console.log("move complete");
				oldiframe.remove();
			}
		});
		iframe.animate({
			left: 0
		}, {
			duration: move_duration,
			queue: false,
			complete: function() {
				iframe.toggleClass("right");
				iframe.toggleClass("left");
			}
		});
	});
}

function next_tab_info(callback) {
	jQuery.ajax({
		url: tab_info_url,
		dataType: 'json',
		cache: false
	}).done(function(data) {
		if(tab_counter >= data.length) {
			tab_counter = 0;
		}
		if(data.length == 0) {
			show_error("Tabs file is empty.");
			window.setTimeout(function() {
				next_tab_info(callback);
			}, 1000);
		} else {
			tab_info = data[tab_counter++];
			callback(tab_info['url'], tab_info['seconds']);
		}
	}).fail(function(x, error) {
		show_error("error: " + error + "\n" + JSON.stringify(x));
		window.setTimeout(function() {
			next_tab_info(callback);
		}, 1000);
	});
}

function show_error(message) {
	console.log(message);
	$("#errorDlg").text(message).fadeIn();
}
