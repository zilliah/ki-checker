$(document).ready(function() {

	//update function (call when eval thingey)
	function calcWhenGrad() {

		//warnings
		var WARN = {
			//warnings for averages
			avgKiOk: false,
			avgKiBad: false,
			avgOvrOK: false,
			avgOvrBad: false,
			//warnings for courses
			sci: false,
			sciBus: false,
			fr: false,
			cs: false,
			csNon: false,
			math: false
		};


		//course counters
		var totalCourses = 0;
		var upperCourses = 0;
		//this will be 
		var labCourses = 0;

		//arrays of which courses are finished
		//separated by section to make things easier but not too annoying
		var integCourses = ["INTEG courses:"];
		var sciCourses = ["Investigative Science courses:"];
		var languages = ["Language courses:"];
		var mathCS = ["Math & CS courses:"];
		var otherBreadth = ["Other Breadth courses:"];
		var electives = ["Electives:"];

		//averages
		var overallAvg = 0;
		var kiAvg = 0;

		//to update course counters
		//need upperCase text, but not joined w/ number
		function upCounters(textCode, numCode, courseList) {
			if (textCode !== "") {
				if (numCode > 199) {
					totalCourses++;
					upperCourses++;
					courseList.push(textCode + " " + numCode);
				} else if (numCode > 99) {
					totalCourses++;
					courseList.push(textCode + " " + numCode);
				}
			}
		}

		//INTEG courses--------------------------------------------------------------------
		for (var iint=0; iint<10; iint++) {
			var currInteg = "#integ" + iint;
			if ($(currInteg).prop('checked')) {
				integCourses.push($(currInteg).val());
				totalCourses++;
				//check to see if >200, 
				//but since these are particular courses, is simplified:
				if (iint > 1) {
					upperCourses++;
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
			//THIS ISN'T WORKING - SEE NOTES
			if (isNaN(sciNum)) {
				confirm("no good"); //****FIX THIS TO A REAL WARNING LATER
				console.log("fail whale");
			};

			//*** BUT WHAT ABOUT LABS?- ignored for now

			//check if course codes are in allowed list
			//allowed course codes:BIOL, CHEM, EARTH, MNS, PHYS
			//not allowed: SCI/SCIBUS  
			
			switch (sciText) {
				case "BIOL":
				case "CHEM":
				case "EARTH":
				case "MNS":
				case "PHYS":
				case "SCI":
				case "SCIBUS":
					break;
				default:
					WARN.sci = true;
			}
			//scibus warning
			if (sciText === "SCI" || sciText === "SCIBUS"){
				WARN.sciBus = true;
			}


			//check for entered data, update appropriate totals/array
			if (sciText !== "" && sciNum > 99) {
				totalCourses++;
				//put courses into sciCourses array
				var currSci = sciText + " " + sciNum;
				sciCourses.push(currSci);
				//check for upper year courses
				if (sciNum > 199) {
					upperCourses++;
				}
				//check for lab
				if ($(sciLabID).prop('checked')) {
					labCourses += 0.5;
				}
			}

		};


		//languages req---------------------------------------------------------------------------
		//english:
		var englNum = $("#engl-num").val();
		var engl = "ENGL" + " " + englNum;
		if (englNum > 199) {
			upperCourses++;
			totalCourses++;
			languages.push(engl);
		} else if (englNum > 99) {
			totalCourses++;
			languages.push(engl);
		}

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
			var fr = frText + " " + frNum;

			//***SIMILAR TO ABOVE, CHECK NUMBER when figure out how


			//check for entered data, inc counters/array
			if (frText !== "" && frNum > 199) {
				upperCourses++;
				totalCourses++;
				languages.push(fr);
			} else if (frText !== "" && frNum > 99) {
				totalCourses++;
				languages.push(fr);
			}

			//check that both are in same language, warn if not
			if (frCompare === "") {
				frCompare = frText;
			} else if (frCompare !== frText) {
				WARN.fr = true;
			}
		}


		//math/CS req----------------------------------------------------------------------------
		//cs
		var csText = $("#cs-text").val();
		var csNum = $("#cs-num").val();
		//check formatting
		csText = csText.toUpperCase();		
		var cs = csText + " " + csNum;
		//inc counters
		upCounters(csText, csNum, mathCS);			
		
		//warn if isn't on pre-approved list
		//cs 100, 115, 135, 145, 200
		if (csText === "CS") {
			switch(csNum) {
					case "100":
					case "115":
					case "135":
					case "145":
					case "200":
						break;
					default:
						WARN.cs = true;
				}
		} else {
			WARN.csNon = true;
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
			//and make nice output for array of courses
 			mathText = mathText.toUpperCase();
 			math = mathText + " " + mathNum;

 			//inc appropriate counters (if stuff entered)
			upCounters(mathText, mathNum, mathCS);			
 			//TODO: else if empty add to list of things to still take??

 			//warn if appropriate
 			if (mathText !== "MATH" && mathText !== "") {
 				WARN.math = true;
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
		upCounters(statText, statNum, mathCS);			
		
		//TODO: else if empty add to list of things to still take??
 		console.log(mathCS);
		
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
				//add to not completed list
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
			upCounters(breText, breNum, otherBreadth);			
		}
		

		//count electives---------------------------------------------------------------------


		//check averages-----------------------------------------------------------
		overallAvg = $("#over-avg").val();
		kiAvg = $("#ki-avg").val();
		

		//if averages low, warn user in results 
		//****i changed stuff, this sec will need to be redone***********
		//2 different warnings now
		if (overallAvg > 77) {
		}
		if (kiAvg > 67) {
		}

		//make results visible
		$('#results').css("display","inline");


		//add relevant warnings to result


 		console.log("up:" + " " + upperCourses);
 		console.log("total" + " " + totalCourses);
		

	}; //end of fxn is here


	//run on click of 'submit' button
	$("#submit").click( function() {
		calcWhenGrad();
		//TODO: make it scroll down automatically

	});

	
	


});
