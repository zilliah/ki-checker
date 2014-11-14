$(document).ready(function() {

	//arrays of which courses are finished
	//separated by section to make things easier but not too annoying
	var integCourses = ["INTEG courses:"];
	var invSci = ["Investigative Science courses:"];
	var languages = ["Language courses:"];
	var mathCS = ["Math & CS courses:"];
	var otherBreadth = ["Other Breadth courses:"];
	var electives = ["Electives:"];
	var electLabs = ["Elective Labs:"];

	var stillToTake = ["Remaining required courses:"];

	//elective input choices
	var chooseLazy = false;
	var chooseHard = false;
	
	//for scrolling
	var $root = $('html, body');

	//show whichever elective entering option is picked
	$("#lazy").click( function() {
		$('#short-form').css("display","inline");
		$('#long-form').css("display","none");
		chooseLazy = true;
		$root.animate({
			scrollTop: $("#electives").offset().top
		}, 600);
	});

	$("#full").click( function() {
		$("#long-form").css("display","inline");
		$("#short-form").css("display","none");
		chooseHard = true;
		$root.animate({
			scrollTop: $("#electives").offset().top
		}, 600);
	});

	//add another row to elective form
	var IDInt = 3; //change this if start with more than 3 elective boxes
	$("#add-more").click( function() {
		for (var addInt = 0; addInt < 3; addInt++) {
			var toAppend = '<input type="text" id="elec' + IDInt
			 + '-text" maxlength="7" size="7" style="text-transform:uppercase">' + " "
			 + '<input type="number" id="elec' + IDInt + '-num" max="999">' + " | ";
			$("#long-form-input").append(toAppend);
			IDInt++; //change this too if want something other than 3 courses per line
		}
		$("#long-form-input").append("<br>");
	});

	//add elective labs - first set
	//move button
	//add fields
	var labIDInt = 0; //change this if start with more than 3 elective boxes
	$("#add-labs").click( function() {
		if (labIDInt === 0) { //move the button the first time
			$("#add-labs").detach().appendTo('#lab-codes');
			$("#lab-input").css("display", "inline");
			labIDInt += 3;
			//autoscroll only the first time
			$root.animate({
    	    	scrollTop: $("#lab-input").offset().top
    		}, 600);
		} else {
			for (var addInt = 0; addInt < 3; addInt++) {
				var toAppend = '<input type="text" id="lab' + labIDInt
				 + '-text" maxlength="7" size="7" style="text-transform:uppercase">' + " "
				 + '<input type="number" id="lab' + labIDInt + '-num" max="999">' + " | ";
				$("#lab-codes").append(toAppend);
				labIDInt++; //change this too if want something other than 3 courses per line
			}
		}
		$("#lab-codes").append("<br>");
	});


	//run on click of 'submit' button
	$("#submit").click( function() {
		calcWhenGrad();
		$root.animate({
    	    scrollTop: $("#results").offset().top
    	}, 600);
	});


	//output .csv of courses 
	$("#dl-csv").click( function() {
		var csvData = [integCourses, invSci, languages, mathCS, otherBreadth, electives, electLabs, stillToTake];
		
		var csvContent = $.map(csvData, function(infoArray, index){
			return infoArray.join(",");
		}).join("\n");
		
		var pom = document.createElement('a');
		var blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
		var url = URL.createObjectURL(blob);
		pom.href = url;
		pom.setAttribute('download', 'ki-checker.csv');
		pom.click();
	}); 



	//update function (call when eval thingey)
	function calcWhenGrad() {

		//clear arrays of old info
		integCourses.length = 1;
		invSci.length = 1;
		languages.length = 1;
		mathCS.length = 1;
		otherBreadth.length = 1;
		electives.length = 1;
		electLabs.length = 1;
		stillToTake.length = 1;

		//warnings
		var WARN = {
			//warning for filling in boxes
			boxWarn: false,
			smallNum: false,
			//warnings for averages
			avgKiOk: false,
			avgKiBad: false,
			avgOvrOk: false,
			avgOvrBad: false,
			noKiAvg: false,
			noOvrAvg: false,
			//warnings for courses
			sciWarn: false,
			sciBus: false,
			englWarn: false,
			frWarn: false,
			csWarn: false,
			csNon: false,
			mathWarn: false
		};


		//course counters
		var totalCourses = 0;
		var upperCourses = 0;
		var labCourses = 0; //counts lab *courses* NOT credits -- used to make sure don't go past 4 lab courses

		//courses remaining

		var reqRemaining = 0;

		//averages
		var overallAvg = 0;
		var kiAvg = 0;

		//to update course counters
		//need upperCase text, but not joined w/ number - nope is uppercased in here now
		function upCounters(textCode, numCode, courseList, section) {
			textCode = textCode.toUpperCase();
			if (textCode !== "") { //there is something in the text box
				if (numCode >= 200) {
					totalCourses++;
					upperCourses++;
					courseList.push(textCode + " " + numCode);
				} else if (numCode >= 100) {
					totalCourses++;
					courseList.push(textCode + " " + numCode);
				} else if (numCode >0) {
					WARN.smallNum = true;
				} else if (numCode === "") { //but nothing in num...give warning
					WARN.boxWarn = true;
					stillToTake.push(section);
					reqRemaining++;
				}
			} else {//nothing in text box 
				if (numCode === "") { //nothing in either -> totally empty
					stillToTake.push(section);
					reqRemaining++;
				} else { //nothing text, something num
					WARN.boxWarn = true;
					stillToTake.push(section);
					reqRemaining++;
				}
			}
		}

	


		//INTEG courses--------------------------------------------------------------------
		for (var iint=0; iint<10; iint++) {
			var currInteg = "#integ" + iint;
			if ($(currInteg).prop('checked')) {
				integCourses.push($(currInteg).val());

				//check if 230 or 231, b/c these are only 0.5 courses
				if (iint === 4 || iint ===5) {
					totalCourses += 0.5;
					upperCourses += 0.5;					
				} else {
					totalCourses++;
					//check to see if >200, 
					//but since these are particular courses, is simplified:
					if (iint > 1) {
						upperCourses++;
					}
				}
			} else {
				stillToTake.push($(currInteg).val());
				//deal with 0.5 courses again:
				if (iint === 4 || iint ===5) {
					reqRemaining += 0.5;
				} else {
					reqRemaining++;
				}
			}
		}

		//science req----------------------------------------------------------------------------
		for (var sint = 1; sint <4; sint++) {
			//all ids, but not each type
			var sciID = "#sci" + sint + "-";
			var sciTextID = sciID + "text";
			var sciNumID = sciID + "num";
			var sciLabID = sciID + "lab";
			//crap, need pull info from html first
			var sciText = $(sciTextID).val();
			var sciNum = $(sciNumID).val();
			//check formatting of course codes
 			sciText = sciText.toUpperCase();
		
			//*** BUT WHAT ABOUT LABS?- ignored for now

			//check if course codes are in allowed list
			if (sciNum >= 100) {
				switch (sciText) {
					case "BIOL":
					case "CHEM":
					case "EARTH":
					case "MNS":
					case "PHYS":
					case "SCI":
					case "SCIBUS":
					case "":
						break;
					default:
						WARN.sciWarn = true;
				}
				//scibus warning
				if (sciText === "SCI" || sciText === "SCIBUS"){
					WARN.sciBus = true;
				}
			}
			//check for entered data, update appropriate totals/array
			upCounters(sciText, sciNum, invSci, "Investigative Science");	


			//check for labs---------------------------------------
			//if have content in text, number, and box is ticked
			if ($(sciLabID).prop('checked') && sciText !== "" && sciNum !== "") { 
				//always add lab here, b/c these are going to be counted before elective labs 
				//(its just easier that way (and makes slightly more sense))
				totalCourses += 0.5;
				labCourses++;
				invSci.push(sciText + " " + sciNum + "L");
				//check if is upper yr lab
				if (sciNum >= 200) {
					upperCourses += 0.5;
				}
			}

		};
		//console.log(invSci);


		//languages req---------------------------------------------------------------------------
		//english:
		var englNum = $("#engl-num").val();
		var englText = $("#engl-text").val();
		upCounters(englText, englNum, languages, "English");	



		//2nd language (eg french)---------------------
		var frCompare = "";
		for (var frint = 1; frint <3; frint++) {
			//all ids, but not each type
			var frID = "#lang" + frint + "-";
			var frTextID = frID + "text";
			var frNumID = frID + "num";

			
			//pull value info from html
			var frText = $(frTextID).val();
			var frNum = $(frNumID).val();

			//format correctly
			frText = frText.toUpperCase();

			//check for entered data, inc counters/array
			upCounters(frText, frNum, languages, "Second Language");			

			//check that both are in same language, warn if not
			if (frNum >= 100) {
				if (frCompare === "") {
					frCompare = frText;
				} else if (frCompare !== frText) {
					WARN.frWarn = true;
				}
			}
		}
		//console.log(languages);

		//math/CS req----------------------------------------------------------------------------
		//cs
		var csText = $("#cs-text").val();
		var csNum = $("#cs-num").val();
		//check formatting
		csText = csText.toUpperCase();		
		//inc counters
		upCounters(csText, csNum, mathCS, "Computer Science");			
		
		//warn if isn't on pre-approved list
		//cs 100, 115, 135, 145, 200
		if (csNum >= 100) {
			if (csText === "CS") {
				switch(csNum) {
						case "100":
						case "115":
						case "135":
						case "145":
						case "200":
							break;
						default:
							WARN.csWarn = true;
					}
			} else if (csText !== "") {
				WARN.csNon = true;
			}
		}

		//math-------------------------------
		//cycle over both math courses
		for (var mint = 1; mint<3; mint++) {
			//acces input
			var mathID = "#math" + mint + "-";
			var mathTextID = mathID + "text";
			var mathNumID = mathID + "num";

			var mathText = $(mathTextID).val();
			var mathNum = $(mathNumID).val();

			//check formatting of course codes
 			mathText = mathText.toUpperCase();

 			//inc appropriate counters (if stuff entered)
			upCounters(mathText, mathNum, mathCS, "Math");			
 			//TODO: else if empty add to list of things to still take??

 			//warn if appropriate
 			if (mathText !== "MATH" && mathText !== "" && mathNum >= 100) {
 				WARN.mathWarn = true;
 			}
		}
	
		//stats-------------------------
		//acces input
		var statText = $("#stat-text").val();
		var statNum = $("#stat-num").val();

		//check formatting of course codes
		//and make nice output for array of courses
		statText = statText.toUpperCase();
		//inc appropriate counters (if stuff entered)
		upCounters(statText, statNum, mathCS, "Stats");			
		
 		//console.log(mathCS);
		
		//other breadth reqs----------------------------------------------------------------------
		//cycle over reqs 
		//for first 2 checkboxes (could prolly combine into a single loop, but i'm lazy)
		var breint = 1;
		for (breint; breint <3; breint++) {
			var breID = "#bre" + breint;
			if ($(breID).prop("checked")) {
				totalCourses++;
				otherBreadth.push($(breID).val());
				if (breint === 2) {
					upperCourses++;
				}
			} else {
				stillToTake.push($(breID).val());
				reqRemaining++;
			}
		}
		//now loop over 2nd 2 elements, which are input vals
		for (breint; breint<5; breint++) {
			var breID = "#bre" + breint + "-";
			var breTextID = breID + "text";
			var breNumID = breID + "num";
			var breText = $(breTextID).val();
			var breNum = $(breNumID).val();
			//format (plus num formatting when i get to that)
			breText = breText.toUpperCase();
			//update counters 
			//but need to get a name for which type to add to stillToTake
			//"Ethics" then "Research Methods"
			if (breint === 3) {
				var breName = "Ethics";
			} else {
				var breName = "Research Methods";
			}

			upCounters(breText, breNum, otherBreadth, breName);			
				//TODO: format course codes for placeholders
		}

		//console.log(otherBreadth);

		//count electives---------------------------------------------------------------------
		//2 options on page, to put number or enter all codes
		var totalElectives = 0;
		var upperElectives = 0;
		var totalLabElectives = 0;
		var upperLabElectives = 0;
		//TODO - need an option thingey to choose which one
		//will this need to be done outside this fxn?

		//option 1: enter numbers only-------------------
		//don't actually /need/ condition, b/c only one actually shows up, but maybe it's a good idea to have it anyway?
		if (chooseLazy) { 
			totalElectives = Number($("#elect-total").val());
			upperElectives = Number($("#elect-upper").val());
			totalLabElectives = Number($("#elect-labs").val());
			upperLabElectives = Number($("#elect-labs-upper").val());

			var lowerLabElectives = totalLabElectives - upperLabElectives;

			//update course totals if elective numbers entered correctly
			if (totalElectives !== NaN) {
				totalCourses += totalElectives; 
				if (upperElectives !== NaN) {
					upperCourses += upperElectives;
				}
			}

			//labs - only count first 4 labs
			while (labCourses <4 && totalLabElectives !== 0) {
				if (totalLabElectives > 0) { //have some labs left in total labs
					totalCourses += 0.5;
					totalLabElectives--;
					labCourses++;
					//check for upper vs lower level labs - check lowers labs off first
					if (lowerLabElectives > 0) {
						lowerLabElectives--;
					} else if (upperLabElectives > 0) { //only counts when now lowerLabElectives left
						upperCourses += 0.5;
						upperLabElectives--;
					}

				}
			} 


		}

		//option 2: enter all course codes--------------
		//have new counters for this section, add to totals after calc'd
		if (chooseHard) {
			//IDInt is number of fields to deal with (starting at 0)
			var hardInt = 0;
			for (hardInt; hardInt < IDInt; hardInt++) {
				var electTextID = "#elec" + hardInt + "-text";
				var electNumID = "#elec" + hardInt + "-num";

				var electText = $(electTextID).val();
				var electNum = $(electNumID).val();

				if (electText !== "") { //there is something in the text box
					electText = electText.toUpperCase();   
					if (electNum >= 200) {
						totalElectives++;
						upperElectives++;
						electives.push(electText + " " + electNum);
					} else if (electNum >= 100) {
						totalElectives++;
						electives.push(electText + " " + electNum);
					} else if (electNum > 0) {
						WARN.smallNum = true;
					} else if (electNum === "") { //but nothing in num...give warning
						WARN.boxWarn = true;
					}
				} else {//nothing in text box 
					if (electNum !== "") { //nothing text, something num
						WARN.boxWarn = true;
					}
				}
			}

			//update totals counters
			totalCourses += totalElectives;
			upperCourses += upperElectives;

			 
			//need to deal with labs somehow (FUCK)
			//counting number of lab COURSES, need to divide later
			for (var hardLabInt = 0; hardLabInt < labIDInt; hardLabInt++) {
				var eLabTextID = "#lab" + hardLabInt + "-text";
				var eLabNumID = "#lab" + hardLabInt + "-num";

				var eLabText = $(eLabTextID).val();
				var eLabNum = Number($(eLabNumID).val());

				//counting labs, including upper years
				//check for partially empty boxes
				if (eLabText !== "") { //there is something in the text box
					eLabText = eLabText.toUpperCase();   
					if (eLabNum >= 200) {
						totalLabElectives++;
						upperLabElectives++;
						electLabs.push(eLabText + " " + eLabNum + "L");
					} else if (eLabNum >= 100) {
						totalLabElectives++;
						electLabs.push(eLabText + " " + eLabNum + "L");
					} else if (eLabNum > 0) {
						WARN.smallNum = true;
					} else if (eLabNum === 0) { //but nothing in num...give warning....TODO why isn't this working?
						WARN.boxWarn = true;
					} 
				} else {//nothing in text box 
					if (eLabNum !== "") { //nothing text, something num
						WARN.boxWarn = true;
					}
				}
			}
			//check for max amount of labs, add to totals
			var lowerLabElectives = totalLabElectives - upperLabElectives;
			while (labCourses <4) {
				if (totalLabElectives > 0) { //have some labs left in total labs
					totalCourses += 0.5;
					totalLabElectives--;
					labCourses++;
					//check for upper vs lower level labs - check lowers labs off first
					if (lowerLabElectives > 0) {
						lowerLabElectives--;
					} else if (upperLabElectives > 0) { //only counts when now lowerLabElectives left
						upperCourses += 0.5;
						upperLabElectives--;
					}
				} else {
					break;
				}
			}


		} //end of hard option

 		//console.log("elect up:" + " " + upperElectives);
 		//console.log("elect total:" + " " + totalElectives);
		//console.log(electives);
 		//console.log("counted lab total:" + " " + labCourses);
		//console.log(electLabs);

		
		//check averages-----------------------------------------------------------
		overallAvg = $("#over-avg").val();
		kiAvg = $("#ki-avg").val();
		
		//if averages low, warn user in results 
		if (overallAvg !== "") {
			if (overallAvg < 65) {
				WARN.avgOvrBad = true;
			} else if (overallAvg <67) {
				WARN.avgOvrOk = true;
			}
		} else { //warn didn't enter average
			WARN.noOvrAvg = true;
		}

		if (kiAvg !== "") {
			if (kiAvg < 75) {
				WARN.avgKiBad = true;
			} else if (kiAvg < 77) {
				WARN.avgKiOk = true;
			}
		} else {
			WARN.noKiAvg = true;
		}
		

		//make "results" div visible------------------------------------------------------------
		$('#results').css("display","inline");


		//find out how many other elective courses
		//number left
		var totalRemaining = 41 - totalCourses;
		var upperRemaining = 27 - upperCourses;
		//make sure they aren't negative
		//if they've done extra courses, just make the number left to take 0
		if (totalRemaining < 0) {
			totalRemaining = 0;
		}
		if (upperRemaining < 0) {
			upperRemaining = 0;
		}

		//add course totals
		//empty totals first
		$("#finished").empty();
		$("#finished-credits").empty();
		$("#totals").empty();
		$("#totals-credits").empty();
		$("#remaining").empty();
		$("#uppers").empty();
		$("#uppers-credits").empty();

		//clear "complete" messages
		$("#totals-complete").empty();
		$("#uppers-complete").empty();

		//add in totals
		$("#finished").append(totalCourses);
		$("#finished-credits").append(totalCourses / 2);
		$("#totals").append(totalRemaining);
		$("#totals-credits").append(totalRemaining / 2);

		//list specific remaining courses 
		//if all reqs done, change message to complete
		if (stillToTake.length === 1) {
			$('#reqs-complete').css("display", "list-item");
			$('#reqs-incomplete').css("display", "none");
		} else {
			for (var add = 1; add < stillToTake.length; add++) {
				//do a thing to put into columns - split where?
				//this is kind of hacky but whatever
				var currDivID = "#list-remaining";
				if (add === 1) {
					//delete old things
					$("#left-remaining").remove();
					$("#middle-remaining").remove();
					$("#right-remaining").remove();
					//make div for integ courses (left column)
					$(currDivID).append('<div id="left-remaining" class="elect-3col">');
					currDivID = "#left-remaining";
					$(currDivID).append('<ul id="left-remaining-ul">');
					currDivID = "#left-remaining-ul";
					$(currDivID).append($("<li>").text(stillToTake[add]));
					$(currDivID).append('</ul>');
					$(currDivID).append('</div>');
				} else if (add > 1 && add < 11) {
					//rest of INTEG courses
					currDivID = "#left-remaining-ul";
					$(currDivID).append($("<li>").text(stillToTake[add]));
				} else if (add === 11) {
					//make div for middle section
					$(currDivID).append('<div id="middle-remaining" class="elect-3col">');
					currDivID = "#middle-remaining";
					$(currDivID).append('<ul id="middle-remaining-ul">');
					currDivID = "#middle-remaining-ul";
					$(currDivID).append($("<li>").text(stillToTake[add]));
					$(currDivID).append('</ul>');
					$(currDivID).append('</div>');
				} else if (add > 11 && add < 17) {
					currDivID = "#middle-remaining-ul";
					$(currDivID).append($("<li>").text(stillToTake[add]));
				} else if (add === 17) {
					//make div for right section
					$(currDivID).append('<div id="right-remaining" class="elect-3col">');
					currDivID = "#right-remaining";
					$(currDivID).append('<ul id="right-remaining-ul">');
					currDivID = "#right-remaining-ul";
					$(currDivID).append($("<li>").text(stillToTake[add]));
					$(currDivID).append('</ul>');
					$(currDivID).append('</div>');
				} else {
					currDivID = "#right-remaining-ul";
					$(currDivID).append($("<li>").text(stillToTake[add]));
				}
				
			}
		}
		$("#uppers").append(upperRemaining);
		$("#uppers-credits").append(upperRemaining / 2);

		//append "complete!" to completed sections
		var completeMessage = "You've completed this requirement.  Good job!";

		if (totalRemaining === 0) {
			$("#totals-complete").append(completeMessage);
		}
		if (upperRemaining === 0) {
			$("#uppers-complete").append(completeMessage);
		}

		//if all sections are done and averages are ok, add graduation message
		if (totalRemaining === 0 && upperRemaining === 0 && stillToTake.length === 1
			&& overallAvg >= 65 && kiAvg >=75) {
			$('#grad').css("display", "inline");
		}

		//add relevant warnings to result------------------------------------------------------
		var count = 0;
		for (var key in WARN) {
			var warnID = "#warn" + count;
			//console.log(WARN[key]);
			if (!WARN[key]) {
				$(warnID).css("display", "none");
			} else {
				$(warnID).css("display", "list-item");
			}
			count++;
		}

/*
		console.log(integCourses);
		console.log(invSci);
		console.log(languages);
		console.log(mathCS);
		console.log(otherBreadth);
		console.log(electives);
		console.log(electLabs);
*/

	}; //end of fxn is here-------------------------------------------------------------------------------------------------
});