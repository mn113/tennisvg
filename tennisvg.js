// Initiate global object: (MAYBE CHANGE TO AN IIFE IF WE WANT MULTIPLE INSTANCES?)
var tennisvg = {
	theSVG: null,		// contains the SVG object, when loaded
	s: null,				// Snap SVG object
	surface: 'surface_hard',	// hard, grass, clay
	mode: 'mode_empty',
	scale: 1.5,
	showBtns: true,
	caption: null,
	p1_json: null,
	p2_json: null,
	g: {				// All the groups of the SVG:	- IS THIS NECESSARY?
		court: null,
		players: null,
		retzones1: null,
		retzones2: null,
		gzones1: null,
		gzones2: null,
		svln_dc1: null,
		svln_ad1: null,
		svln_dc2: null,
		svln_ad2: null,
		svbox_dc1: null,
		svbox_ad1: null,
		svbox_dc2: null,
		svbox_ad2: null,
		returnstats1: null,
		returnstats2: null,
		servestats1: null,
		servestats2: null,
		netstats: null,
		buttons: null
	},

	// Prepare all court groups for quick access:
	setupCourt: function () {
		//var g = this.groups;	// MAJOR SURGERY...
		var	svgDoc = this.theSVG.contentDocument;	// Get the inner DOM of the SVG object
		// Get each SVG group:
		this.g.court = svgDoc.getElementById("court");
		this.g.players = svgDoc.getElementById("players");
		this.g.retzones1 = svgDoc.getElementById("return_zones_1");
		this.g.retzones2 = svgDoc.getElementById("return_zones_2");
		this.g.gzones1 = svgDoc.getElementById("groundie_zones_1");
		this.g.gzones2 = svgDoc.getElementById("groundie_zones_2");
		this.g.svln_dc1 = svgDoc.getElementById("serve_line_deuce_1");
		this.g.svln_ad1 = svgDoc.getElementById("serve_line_ad_1");
		this.g.svln_dc2 = svgDoc.getElementById("serve_line_deuce_2");
		this.g.svln_ad2 = svgDoc.getElementById("serve_line_ad_2");
		this.g.svbox_dc1 = svgDoc.getElementById("serve_box_stats_deuce_1");
		this.g.svbox_ad1 = svgDoc.getElementById("serve_box_stats_ad_1");
		this.g.svbox_dc2 = svgDoc.getElementById("serve_box_stats_deuce_2");
		this.g.svbox_ad2 = svgDoc.getElementById("serve_box_stats_ad_2");
		this.g.returnstats1 = svgDoc.getElementById("return_stats_1");
		this.g.returnstats2 = svgDoc.getElementById("return_stats_2");
		this.g.servestats1 = svgDoc.getElementById("serve_stats_1");
		this.g.servestats2 = svgDoc.getElementById("serve_stats_2");
		this.g.netstats = svgDoc.getElementById("net_stats");
		this.g.buttons = svgDoc.getElementById("buttons");

		// Set opacities to 1:
		$(this.g.retzones1).attr("opacity", "1");	// ok
		$(this.g.retzones2).attr("opacity", "1");	// ok
		$(this.g.gzones1).attr("opacity", "1");		// ok
		$(this.g.gzones2).attr("opacity", "1");		// ok
		$(this.g.svbox_dc1).attr("opacity", "1");	// ok
		$(this.g.svbox_ad1).attr("opacity", "1");	// ok
		$(this.g.svbox_dc2).attr("opacity", "1");	// ok
		$(this.g.svbox_ad2).attr("opacity", "1");	// ok
		$(this.g.returnstats1).attr("opacity", "1");	// ok
		$(this.g.returnstats2).attr("opacity", "1");	// ok
		$(this.g.servestats1).attr("opacity", "1");	// ok
		$(this.g.servestats2).attr("opacity", "1");	// ok
		$(this.g.netstats).attr("opacity", "1");	// ok

		// Lines to 0.5 opacity:
		$(this.g.svln_dc1).attr("opacity", "0.5");	// ok
		$(this.g.svln_ad1).attr("opacity", "0.5");	// ok
		$(this.g.svln_dc2).attr("opacity", "0.5");	// ok
		$(this.g.svln_ad2).attr("opacity", "0.5");	// ok

		// Don't show them all!
		this.svgHideAll();
		// Show/hide buttons:
		if (!this.showBtns) { this.svgHide(this.g.buttons) }
		// Court colour:
		this.setSurface(this.surface);
	},

	// Change the scale (size) of the rendered SVG:
	setScale: function (scale) {
		var cd = this.theSVG.contentDocument;
		// Set new scale attribute:
		$(cd).find("#scale").attr("transform", "scale(" + scale + ")");
		// Set new width & height:
		$(cd).children("svg").attr("width", 250 * scale)
							 .attr("height", 250 * scale);	// It will remain a square
		this.scale = scale;
	},

	// Change the court colour:
	setSurface: function (surface) {
		var ct = this.g.court;
		switch (surface) {
		case 'surface_hard':
			$(ct).attr("fill", "steelblue");
			break;
		case 'surface_grass':
			$(ct).attr("fill", "yellowgreen");
			break;
		case 'surface_clay':
			$(ct).attr("fill", "goldenrod");
			break;
		}
		return;
	},

	// Show each group in a given list:
	svgShow: function (els) {
		$(els).each(function () {
			$(this).show();
		});
		return;
	},

	// Hide each group in a given list:
	svgHide: function (els) {
		$(els).each(function () {
			$(this).hide();
		});
		return;
	},

	// Hide all groups:
	svgHideAll: function () {

		this.svgHide([this.g.court, this.g.players,
					 this.g.retzones1, this.g.retzones2, this.g.gzones1, this.g.gzones2,
					 this.g.svln_dc1, this.g.svln_ad1, this.g.svbox_dc1, this.g.svbox_ad1,
					 this.g.svln_dc2, this.g.svln_ad2, this.g.svbox_dc2, this.g.svbox_ad2,
					 this.g.returnstats1, this.g.returnstats2,
					 this.g.servestats1, this.g.servestats2, this.g.netstats]);	// Ugly way to hide EVERYTHING (works)

		// Show court & players again:
		this.svgShow([this.g.court, this.g.players]);
		return;
	},

	// Populate individual SVG data fields (usually just called via jsonPopulate()):
	populate: function (dest, input) {
		var data;
		// Integerise all numbers:
		try {
			data = $.map(input, function (x) {
				return parseInt(Math.round(x), 10);
			});
		} catch (e) {
				console.log(e);
				return false;
		}
		//console.log(data);
		switch (dest) {
		case 'player1':
			var t = $(this.g.players).children("text");
			t.filter(":last").text(input[0]);
			break;
		case 'player2':
			var t = $(this.g.players).children("text");
			t.filter(":first").text(input[0]);
			break;

		case 'netstats1':
			var t = $(this.g.netstats).children().children("tspan");	// tspans are 2 deep
			t.filter(":last").text(data[0] + '/' + data[1]);
			break;
		case 'netstats2':
			var t = $(this.g.netstats).children().children("tspan");	// tspans are 2 deep
			t.filter(":first").text(data[0] + '/' + data[1]);
			break;

		case 'returnstats1':	// Fallthrough case
			var t = $(this.g.returnstats1).children().children("tspan");	// tspans are 2 deep
		case 'returnstats2':
			if (!t) { var t = $(this.g.returnstats2).children().children("tspan"); }	// tspans are 2 deep
			t.filter(":first").text(data[0]);
			t.filter(":last").text(data[1]);
			break;

		case 'servestats1':		// Fallthrough case
			var t = $(this.g.servestats1).children().children("tspan");	// tspans are 2 deep
		case 'servestats2':
			if (!t) { var t = $(this.g.servestats2).children().children("tspan"); }	// tspans are 2 deep
			t.filter(":first").text(data[0]);
			t.filter(":eq(1)").text(data[1]);
			t.filter(":eq(2)").text(data[2]);
			break;

		case 'groundies1':			// Fallthrough case
			var t = $(this.g.gzones1);
		case 'groundies2':
			if (!t) { var t = $(this.g.gzones2); }

			// Opacity normalising math:
			var total = data[0] + data[1] + data[2],
				p1 = Math.round(50 * data[0] / total),
				p2 = Math.round(50 * data[1] / total),
				p3 = Math.round(50 * data[2] / total);

			// Numbers
			var t1 = t.children("text").children("tspan");	// tspans are 2 deep
			t1.filter(":first").text(p1);
			t1.filter(":eq(1)").text(p2);
			t1.filter(":eq(2)").text(p3);
			// Rects (opacity)
			var t2 = t.children("rect");
			t2.filter(":first").attr('opacity', p1 / 100);
			t2.filter(":eq(1)").attr('opacity', p2 / 100);
			t2.filter(":eq(2)").attr('opacity', p3 / 100);
			break;

		case 'returnzones1':		// Fallthrough case
			var t = $(this.g.retzones1).children();
		case 'returnzones2':
			if (!t) { var t = $(this.g.retzones2).children(); }

			// Opacity normalising math:
			var total = data[0] + data[1] + data[2] + data[3] + data[4] + data[5] + data[6] + data[7] + data[8],
				p1 = Math.round(50 * data[0] / total),
				p2 = Math.round(50 * data[1] / total),
				p3 = Math.round(50 * data[2] / total),
				p4 = Math.round(50 * data[3] / total),
				p5 = Math.round(50 * data[4] / total),
				p6 = Math.round(50 * data[5] / total),
				p7 = Math.round(50 * data[6] / total),
				p8 = Math.round(50 * data[7] / total),
				p9 = Math.round(50 * data[8] / total);

			t.filter(":eq(0)").attr('opacity', 2 * p1 / 100);
			t.filter(":eq(1)").attr('opacity', 2 * p2 / 100);
			t.filter(":eq(2)").attr('opacity', 2 * p3 / 100);
			t.filter(":eq(3)").attr('opacity', 2 * p4 / 100);
			t.filter(":eq(4)").attr('opacity', 2 * p5 / 100);
			t.filter(":eq(5)").attr('opacity', 2 * p6 / 100);
			t.filter(":eq(6)").attr('opacity', 2 * p7 / 100);
			t.filter(":eq(7)").attr('opacity', 2 * p8 / 100);
			t.filter(":eq(8)").attr('opacity', 2 * p9 / 100);
			break;

		case 'serve_box_deuce1':			// Fallthrough case
			var t = $(this.g.svbox_dc1);
		case 'serve_box_ad1':				// Fallthrough case
			if (!t) { var t = $(this.g.svbox_ad1); }
		case 'serve_box_deuce2':			// Fallthrough case
			if (!t) { var t = $(this.g.svbox_dc2); }
		case 'serve_box_ad2':				// to manage deuce/ad 1/2
			if (!t) { var t = $(this.g.svbox_ad2); }
			// Numbers
			var t1 = t.children("text").children("tspan");	// tspans are 2 deep
			t1.filter(":first").text(data[0]);
			t1.filter(":eq(1)").text(data[1]);
			t1.filter(":eq(2)").text(data[2]);
			// Rects (bar height)
			var t2 = t.children().children("rect"),
				total = data[3] + data[4] + data[5] + data[6] + data[7] + data[8],
				h4a = 50 * data[3] / total,
				h4b = 50 * data[4] / total,
				h5a = 50 * data[5] / total,
				h5b = 50 * data[6] / total,
				h6a = 50 * data[7] / total,
				h6b = 50 * data[8] / total;
			t2.filter(":first").attr('height', h4a);
			t2.filter(":eq(1)").attr('height', h4b);
			t2.filter(":eq(2)").attr('height', h5a);
			t2.filter(":eq(3)").attr('height', h5b);
			t2.filter(":eq(4)").attr('height', h6a);
			t2.filter(":eq(5)").attr('height', h6b);
			break;

		case 'aces_deuce1':					// Fallthrough case
			var t = $(this.g.svbox_dc1);
		case 'aces_ad1':					// Fallthrough case
			if (!t) { var t = $(this.g.svbox_ad1); }
		case 'aces_deuce2':					// Fallthrough case
			if (!t) { var t = $(this.g.svbox_dc2); }
		case 'aces_ad2':
			if (!t) { var t = $(this.g.svbox_ad2); }
			// Aces
			var t3 = t.children().children("text").children("tspan");
			t3.filter(":first").text((data[0] > 0) ? data[0] : '');	// hide number if 0 aces
			t3.filter(":eq(1)").text((data[1] > 0) ? data[1] : '');
			t3.filter(":eq(2)").text((data[2] > 0) ? data[2] : '');
			var t4 = t.find("circle");
			t4.filter(":first").attr('r', (data[0] > 0) ? 2 : 0);	// hide ball if 0 aces
			t4.filter(":eq(1)").attr('r', (data[1] > 0) ? 2 : 0);
			t4.filter(":eq(2)").attr('r', (data[2] > 0) ? 2 : 0);
			break;
		} // end switch

		return;
	},

	// Populate the entire SVG (well, one player's half!) from a single JSON object:
	jsonPopulate: function (who, json) {
		who = (who == 'p2') ? 'p1' : 'p2';			// This is where necessary reversal of p1 & p2 occurs
		if (who == 'p1') {
			this.populate('player1', [json.name]);	// populate() needs array
			this.populate('netstats1', json.np);
			this.populate('groundies1', json.gz);
			this.populate('returnzones1', json.rz);
			this.populate('returnstats1', json.rs);
			this.populate('servestats1', json.ss);
			this.populate('serve_box_deuce1', json.sbd.concat(json.sbdwl));
			this.populate('serve_box_ad1', json.sba.concat(json.sbawl));
			this.populate('aces_deuce1', json.sbda);
			this.populate('aces_ad1', json.sbaa);
		} else if (who == 'p2') {
			this.populate('player2', [json.name]);	// populate() needs array
			this.populate('netstats2', json.np);
			this.populate('groundies2', json.gz.reverse());	// reverse data because rotated 180º
			this.populate('returnzones2', json.rz);
			this.populate('returnstats2', json.rs);
			this.populate('servestats2', json.ss);
			var sbd2 = json.sbd.reverse(),					// reverse data because rotated 180º
				sba2 = json.sba.reverse(),					// reverse data because rotated 180º
				sbdwl2 = json.sbdwl.reverse(),				// reverse data because rotated 180º
				sbawl2 = json.sbawl.reverse();				// reverse data because rotated 180º
			this.populate('serve_box_deuce2', sbd2.concat(sbdwl2));	// join 3 + 6
			this.populate('serve_box_ad2', sba2.concat(sbawl2));	// join 3 + 6
			this.populate('aces_deuce2', json.sbda.reverse());	// reverse data because rotated 180º
			this.populate('aces_ad2', json.sbaa.reverse());		// reverse data because rotated 180º
		}
		return;
	},

	// Set the mode of stats display (serve, return, groundies):
	setMode: function (mode) {
		// Set mode:
		this.mode = mode ? mode : 'mode_empty';		// use a default if mode not passed

		// Initialise Snap:
		this.s = Snap("#tennisvg");

		// Remove & add button classes:
		var minimode = mode.split('_')[1],
			currentBtn = this.s.select("#buttons g#" + minimode + "_btn"),
			selBtn = this.s.select("#buttons g.selected");
		if (selBtn) {
			selBtn.removeClass("selected");		// ERROR IF NOTHING MATCHED
		}
		if (currentBtn) {
			currentBtn.addClass("selected");
		}

		this.svgHideAll();

		// Modeswitcher:
		switch (this.mode) {	// NB: Player 1 is on top, but their serve/return stats are in the bottom (2) half
		case 'mode_serve1':
			this.svgShow([this.g.svln_dc2, this.g.svln_ad2, this.g.svbox_dc2, this.g.svbox_ad2, this.g.servestats2]);
			break;

		case 'mode_serve2':
			this.svgShow([this.g.svln_dc1, this.g.svln_ad1, this.g.svbox_dc1, this.g.svbox_ad1, this.g.servestats1]);
			break;

		case 'mode_return1':
			this.svgShow([this.g.retzones2, this.g.returnstats2]);
			break;

		case 'mode_return2':
			this.svgShow([this.g.retzones1, this.g.returnstats1]);
			break;

		case 'mode_groundies':
			this.svgShow([this.g.gzones1, this.g.gzones2, this.g.netstats]);
			break;

		case 'mode_empty':
			// Let all layers remain hidden
			break;
		} // end switch

		return;
	},

	// Check whether a JSON object obeys the format (types, lengths, number members):
	isValidData: function (data) {
		function areNumbers (arr) {
			for	(var i = 0; i < arr.length; i++) {
				if (!(typeof arr[i] == "number")) { return false; }
			}
			return true;	// None of the "numbers" failed
		}

		// Get out with short diagnostic message if a test fails:
		function badData (msg) {
			console.log('Bad data:', msg);
			return false;
		}

		// Name tests:
		if (!(typeof data.name == "string")) { return badData(data.name); }
		if (data.name.length < 2) { return badData(data.name); }

		// Remaining tests in a loop:
		var keys = ['ss','sbd','sbdwl','sbda','sba','sbawl','sbaa','rs','rz','gz','np'],
			lens = [3,3,6,3,3,6,3,2,9,3,2];
		for (var k = 0; k < keys.length; k++) {
			var propname = keys[k],
				arr = data[propname];
			// Array test:
			if (!(arr instanceof Array)) { return badData(arr + ' not Array'); }
			// Length test:
			if (arr.length !== lens[k]) { return badData(arr + ' incorrect length'); }
			// NUmbers test:
			if (!areNumbers(arr)) { return badData(arr + ' not numbers'); }
		}

		// If we got this far, none of the tested attributes failed the type, length or number tests:
		return true;
	},

	// SVG buttons click-handler:
	buttonClick: function (event) {
		// Get the desired mode from the target element's id:
		//var tar = event.target,
		var	tid = $(event.target).parent().attr("id"),
			mode = 'mode_' + tid.split('_')[0];
		console.log(mode);
		// Act on button id:
		tennisvg.setMode(mode);
	},

	// Attach click handlers etc:
	bindUIEvents: function () {

	},

	init: function () {
		console.log("tennisvg.init(): ", this);
		this.setupCourt();
		this.setMode('mode_empty');
		this.bindUIEvents();
		// what else in here?
		return;
	}

};	// end of tennisvg object


// jQuery ready function:
$(function () {

	// Select SVG object:
	tennisvg.theSVG = document.getElementById("tennisvg");
    // It's important to add a load event listener to the object, as it will load the svg doc asynchronously:
	tennisvg.theSVG.addEventListener("load", function () {
		// MAIN EXECUTION STARTS:
		tennisvg.init();
	}, false);	// no callback

	// Check for query string:
	if (location.search) {
		var data = location.search.substring(1,location.search.length),	// Trim leading '?'
			urlJSON = JSON.parse(decodeURIComponent(data));
		console.log("Query string:", data);
		console.log(urlJSON);
		// Split to separate players:
		if (urlJSON.p1_json && urlJSON.p2_json) {
			var s = splitJSON(urlJSON);
			preProcessJSON(s[0], s[1]);
		}
		else {
			// Identical twins match:
			preProcessJSON(urlJSON, urlJSON);
		}
	}

	// Set buttons, court, and populate SVG:
	function preProcessJSON (p1_json, p2_json) {
		// Change button text:
		$("#mode_serve1 span").text(p1_json.name);
		$("#mode_serve2 span").text(p2_json.name);
		$("#mode_return1 span").text(p1_json.name);
		$("#mode_return2 span").text(p2_json.name);

		// Get & set surface:
		var sf = $("#matches option:selected").attr("data-surface");
		tennisvg.setSurface("surface_" + sf);

		// Populate SVG with data:
		tennisvg.jsonPopulate('p1', p1_json);
		tennisvg.jsonPopulate('p2', p2_json);
		return;
	}

	function mergeJSON (p1_json, p2_json) {
		var mergedJSON = {
			'p1_json': p1_json,
			'p2_json': p2_json
		}
		return mergedJSON;
	}

	function splitJSON (mergedJSON) {
		var p1_json = mergedJSON.p1_json,
			p2_json = mergedJSON.p2_json;
		return [p1_json, p2_json];
	}

	// Set up surface buttons:		// NOT NEEDED
	$("#switcher button[id^=surface]").click(function (event) {
		tennisvg.setSurface(this.id);
		event.preventDefault();
	});

	// Set up mode buttons:			// NOT NEEDED
	$("#switcher button[id^=mode]").click(function (event) {
		tennisvg.setMode(this.id);
		event.preventDefault();
	});

	// Set up match dropdown actions:
	$("#matches").on("change", function () {
		$("#user_input").hide();
		$("#match_info").show();

		// Load match byline in H2 below court:
		$("#match_info h2").html($("#matches option:selected").text());

		var matchclass = $("#matches option:selected").val();

		// Handle user JSON input:
		if (matchclass == 'User') {
			$("#match_info").hide();
			$("#user_input").show();	// Show the textareas and just wait for submit
		} else {
			// Hide all and then unhide JSON strings:
			$("#match_info code").hide();
			$("#match_info code."+matchclass).show();
			// Get JSON strings:
			var p1_json = JSON.parse($("#match_info code:visible:first").text()),
				p2_json = JSON.parse($("#match_info code:visible:eq(1)").text());
			// Send to SVG:
			preProcessJSON(p1_json, p2_json);
		}
	});

	// Set up user input submit button:
	$("#user_input").submit(function (event) {
		event.preventDefault();
		// Get what the user has entered in the textareas:
		var p1_json = JSON.parse($("#user_input textarea:first").val()),
			p2_json = JSON.parse($("#user_input textarea:last").val());
		console.log(p1_json, p2_json);

		// Check valid JSON first:
		if (tennisvg.isValidData(p1_json) && tennisvg.isValidData(p2_json)) {
			preProcessJSON(p1_json, p2_json);
		}
	});

	// Import & show JSONguide fragment when link is clicked:
	$("a.jgshower").click(function (event) {
		event.preventDefault();
		$("#jsonguide").show();
		$("#user_input").after($('<div id="jsonguide">'));	// ok
		$("#jsonguide").load("jsonguide.html");
	});

}); // end jQuery
