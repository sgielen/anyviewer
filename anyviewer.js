// Configuration
tab_info_url = "tabs.json";
move_duration = 2000;
// The default time to wait for a new tab load, until we assume it's probably
// broken and not going to load. Can be changed in the "tabs.json" file by
// setting 'timeout' to some other value.
default_timeout_seconds = 10;

// State variables
tab_counter = 0;
start_next_tab();

// Functions
function start_next_tab() {
	next_tab_info(function(url, timeout_seconds, seconds) {
		load_tab(url, timeout_seconds, function(success) {
			if(!success) seconds = 4;
			window.setTimeout(start_next_tab, seconds * 1000);
		});
	});
}

function load_tab(url, timeout_seconds, callback) {
	$("#loading").hide();
	$("#errorDlg").fadeOut();
	oldiframe = $("iframe.left");
	iframe = $("<iframe>").toggleClass("right");
	iframe.css("width", $(window).width());
	iframe.css("height", $(window).height());
	iframe.css("left", $(window).width());
	iframe.attr("src", url);
	$("body").append(iframe);
	if(oldiframe.length == 0) {
		iframe.css("left", 0);
		iframe.toggleClass("right");
		iframe.toggleClass("left");
		callback(true);
		return;
	}
	timeoutTimer = window.setTimeout(function() {
		load_tab_error(callback);
		iframe.remove();
	}, timeout_seconds * 1000);
	iframe.load(function() {
		clearTimeout(timeoutTimer);
		oldiframe.animate({
			left: -$(window).width()
		}, {
			duration: move_duration,
			queue: false,
			complete: function() {
				// if load_tab() is called before this point,
				// it's possible there are two iframes with
				// class left. This breaks the animation.
				oldiframe.remove();
				callback(true);
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
	}).error(function() {
		clearTimeout(timeoutTimer);
		load_tab_error(callback);
	});
}

function load_tab_error(callback) {
	show_error("An error occured with tab " + tab_counter
	    + ", skipping...");

	// Act as if this tab loaded just fine
	callback(false);
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
			timeout = tab_info['timeout'];
			if(!timeout) {
				timeout = default_timeout_seconds;
			}
			callback(tab_info['url'], timeout, tab_info['seconds']);
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
