// this script is a variation of the script addTimeStamp.js that is installed with PH7
				#target photoshop
				app.bringToFront();

	var originalDialogMode = app.displayDialogs;
	app.displayDialogs = DialogModes.ERROR;
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;
	
	try
	{
		var docRef = activeDocument;

		// Now create a text layer at the front
		var myLayerRef = docRef.artLayers.add();
		myLayerRef.kind = LayerKind.TEXT;
		myLayerRef.name = "Filename";
		
		var myTextRef = myLayerRef.textItem;
		
		// strip the extension off
		var fileNameNoExtension = docRef.name;
		fileNameNoExtension = fileNameNoExtension.split( "." );
		if ( fileNameNoExtension.length > 1 ) {
			fileNameNoExtension.length--;
		}
		fileNameNoExtension = fileNameNoExtension.join(".");
			
		myTextRef.contents = fileNameNoExtension;
		
		// off set the text to be in the middle
		//myTextRef.position = new Array( docRef.width / 2, docRef.height / 2 );
		myTextRef.position = new Array( 20, 20 );
		myTextRef.size = 10;
        
        
        
        
        
            
        
        
        
        
	}
	catch( e )
	{
		// An error occurred. Restore ruler units, then propagate the error back
		// to the user
		preferences.rulerUnits = originalRulerUnits;
        app.displayDialogs = originalDialogMode;
		throw e;
	}

	// Everything went Ok. Restore ruler units
	preferences.rulerUnits = originalRulerUnits;
	app.displayDialogs = originalDialogMode;




function executeThisPre() {
				$.writeln(theFullFileName);
				open( File(theFullFileName));
				app.bringToFront();
				var docRef = app.activeDocument;
				 preferences.rulerUnits = Units.INCHES;
				 app.displayDialogs = DialogModes.NO;
				var doc = docRef;
				var doc_name = docRef.fullName;
				document_has_profile = 'true' ;

				try{
					var dod = doc.colorProfileName;
					} catch(e) { document_has_profile = 'false'; }
				var ttt = 'ttt'	
				//alert( document_has_profile );	
				//alert( dod );
				if ( document_has_profile == 'true') {
									if (dod.indexOf('Max') > -1) {				
										//alert('Already  SWOP (Coated), 20%, GCR, Maximum');
										executeThis();
										}
									if (dod.indexOf('Max') <= -1) {
										//alert('This file is not in CYMK Black maximum');
										fileFoldObj.rename('wrong-profile-' + theFileName.toString() );
										docRef.close(SaveOptions.DONOTSAVECHANGES );
										}
						} else {
								fileFoldObj.rename('no-profile-' + theFileName.toString() );
								docRef.close(SaveOptions.DONOTSAVECHANGES );
							}
}

function executeThis() {
//~ 			app.bringToFront();
//~ 			var docRef = app.activeDocument;
//~ 			 preferences.rulerUnits = Units.INCHES;
//~ 			 app.displayDialogs = DialogModes.NO;
			var docRef = app.activeDocument;
			 refitImage();
			 docRef.save();
//~ 			 var doc = docRef;
//~ 			var dod = doc.colorProfileName;
//~ 			if (dod.indexOf('Max') > -1) {
//~ 				alert('Already  SWOP (Coated), 20%, GCR, Maximum');
				runAction('RUN PRINT DRIVER', 'SAKURI PRINT DRIVER' );
				createRegistrationImage();
				placeRegistration();
				thigTheColors();
				runAction('SAVE_SEPARATION', 'SAKURI PRINT DRIVER' );
				docRef.close(SaveOptions.DONOTSAVECHANGES );
//~ 			}
//~ 		else{
//~ 				alert('dod needs work');
//~ 				moveFileToPleaseConvert();
//~ 			}
			//if (dod == 'SWOP (Coated), 10%, GCR, Maximum') {
			// alert('Already  SWOP (Coated), 10%, GCR, Maximum');
			//}
			//if (dod != 'SWOP (Coated), 10%, GCR, Maximum') {
//runAction('RUN PRINT DRIVER', 'PREP_IMAGE' );					
					//alert(docRef.colorProfileName);
			//}
			//------------------------------------------------------------------------------------------------------------------------------------

}
//------------------------------------------------------------------------------------------------------------------------------------
function runAction(atn, atnSet) { 
  try { 
    app.doAction(atn, atnSet);
  } catch (e) { 
    if (e.toString().match(/action.+is not currently available/)) { 
      return false; 
    } else { 
      throw e; 
    } 
  } 
  return true; 
}

function refitImage() {	
	var strtRulerUnits = app.preferences.rulerUnits;	
	app.preferences.rulerUnits = Units.INCHES;	
	var docRef = app.activeDocument; 
	try {
				var bottomLayer = docRef.backgroundLayer;
					if (bottomLayer.name == "Background") {
						if ( bottomLayer.visible ) {
							//alert("is visible");
							bottomLayer.visible = false;
						}else {
						  //alert("not visible");
						}
					}
	} catch (e) {
					// put error stuff here
	}
	docRef.trim( TrimType.TRANSPARENT, 1,1,1,1); 	
	docRef.resizeImage(docRef.width,docRef.height,200,ResampleMethod.BICUBIC);	
	var newHeight = docRef.height + .25 ;	
	docRef.resizeCanvas(docRef.width, newHeight, AnchorPosition.BOTTOMCENTER);	
	var newWidthForAdhesive = docRef.width + .06 ;
	var newHeightForAdhesive = docRef.height + .06 ;
	docRef.resizeCanvas(newWidthForAdhesive, newHeightForAdhesive, AnchorPosition.TOPCENTER);
	app.preferences.rulerUnits = strtRulerUnits;
}

//------------------------------------------------------------------------------------------------------------------------------------
function placeRegistration() {
	var docRef = app.activeDocument;
	 docRef.activeChannels = [ activeDocument.channels.getByName( 'Cyan' ), 
 	activeDocument.channels.getByName( 'Magenta' ), 
 	activeDocument.channels.getByName( 'Yellow' ), 
 	activeDocument.channels.getByName( 'Black' )]
	
	createCornerSelection(  "TOP_LEFT" )
	docRef.paste();
	docRef.activeLayer.name = "REGISTRATION";
	createCornerSelection(  "TOP_RIGHT" )
	docRef.paste();
	docRef.activeLayer.merge();
	createCornerSelection(  "BOTTOM_LEFT" )
	docRef.paste();
	docRef.activeLayer.merge();
	//-----------------------------------------------------------------------------------------------------------------------------
	docRef.selection.selectAll();
	docRef.activeLayer.copy();
	 docRef.activeChannels = [ activeDocument.channels.getByName( 'WHITE' )]
	docRef.paste();
	 docRef.activeChannels = [ activeDocument.channels.getByName( 'ADHESIVE' )]
	docRef.paste();
//	docRef.activeLayer.translate( 2, 2 );   //MOVES RELATIVELY
// MOVE REGISTRATION LAYER TO TOP
	docRef.activeLayer.move( app.activeDocument.layers[0], ElementPlacement.PLACEBEFORE ); 
	}
//------------------------------------------------------------------------------------------------------------------------------------
function createCornerSelection(  quadrant ) {
	var docRef = app.activeDocument;
		var cellSize = 5;
		var h = 0 ;
		var v = 0 ;	
		if (quadrant == "TOP_LEFT") {
			var h = 0 ;
			}
		if (quadrant == "TOP_RIGHT") {
			var h = docRef.width.as('px') - 5 ;
			}
		if (quadrant == "BOTTOM_LEFT") {
			var v = docRef.height.as('px') - 5 ;
			}
		var selRegion = Array(Array(h,v),
					Array(h+cellSize, v),
					Array(h + cellSize, v + cellSize),
					Array(h, v + cellSize),
					Array(h, v ));
					docRef.selection.select(selRegion);
	}
//------------------------------------------------------------------------------------------------------------------------------------
function createRegistrationImage() {
	var docRef = app.activeDocument;
			var docRes = docRef.resolution;
		    app.preferences.rulerUnits = Units.INCHES;
			var regDocRef = app.documents.add(.125, .125 , docRes, null, NewDocumentMode.CMYK , DocumentFill.WHITE);
			regDocRef.selection.selectAll();
			var strokeColor = new SolidColor(); 
			strokeColor.cmyk.cyan = 100; 
			strokeColor.cmyk.magenta = 100; 
			strokeColor.cmyk.yellow = 100; 
			strokeColor.cmyk.black = 100; 
			createWhiteAndAdhesiveChannelsThig();
//			var channel_to_name = regDocRef.channels ;
//			regDocRef.activeChannels = Array( 'Cyan' ,'Magenta', 'Yellow', 'Black','WHITE','ADHESIVE') ;
			selectAllChannels ();
			regDocRef.selection.selectAll();
			regDocRef.selection.stroke(strokeColor, 1 , StrokeLocation.INSIDE, ColorBlendMode.NORMAL, 100, false); 
			crosshairs();
			regDocRef.selection.selectAll();
			regDocRef.selection.copy();
			regDocRef.close(SaveOptions.DONOTSAVECHANGES );
	}
//------------------------------------------------------------------------------------------------------------------------------------
function setColors() {
	var idsetd = charIDToTypeID( "setd" );
		var desc143 = new ActionDescriptor();
		var idnull = charIDToTypeID( "null" );
			var ref121 = new ActionReference();
			var idClr = charIDToTypeID( "Clr " );
			var idFrgC = charIDToTypeID( "FrgC" );
			ref121.putProperty( idClr, idFrgC );
		desc143.putReference( idnull, ref121 );
		var idT = charIDToTypeID( "T   " );
			var desc144 = new ActionDescriptor();
			var idCyn = charIDToTypeID( "Cyn " );
			desc144.putDouble( idCyn, 100.000000 );
			var idMgnt = charIDToTypeID( "Mgnt" );
			desc144.putDouble( idMgnt, 100.000000 );
			var idYlw = charIDToTypeID( "Ylw " );
			desc144.putDouble( idYlw, 100.000000 );
			var idBlck = charIDToTypeID( "Blck" );
			desc144.putDouble( idBlck, 100.000000 );
		var idCMYC = charIDToTypeID( "CMYC" );
		desc143.putObject( idT, idCMYC, desc144 );
	executeAction( idsetd, desc143, DialogModes.NO );
	}
//------------------------------------------------------------------------------------------------------------------------------------




function selectAllChannels() {
	  var regDocRef = app.activeDocument;
	  regDocRef.activeChannels = [ activeDocument.channels.getByName( 'Cyan' ), 
 	activeDocument.channels.getByName( 'Magenta' ), 
 	activeDocument.channels.getByName( 'Yellow' ), 
 	activeDocument.channels.getByName( 'Black' ), 
	activeDocument.channels.getByName( 'WHITE' ), 
	activeDocument.channels.getByName( 'ADHESIVE' )
	]; 
	}



function selectAllChannelsThig() {
	// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idCMYK = charIDToTypeID( "CMYK" );
        ref1.putEnumerated( idChnl, idChnl, idCMYK );
    desc2.putReference( idnull, ref1 );
executeAction( idslct, desc2, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        ref2.putName( idChnl, "WHITE" );
    desc3.putReference( idnull, ref2 );
    var idExtd = charIDToTypeID( "Extd" );
    desc3.putBoolean( idExtd, true );
executeAction( idslct, desc3, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc4 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref3 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    ref3.putName( idChnl, "ADHESIVE" );
    desc4.putReference( idnull, ref3 );
    var idExtd = charIDToTypeID( "Extd" );
    desc4.putBoolean( idExtd, true );
	executeAction( idslct, desc4, DialogModes.NO );
	}

function resetSwatch() {
	var idRset = charIDToTypeID( "Rset" );
    var desc6 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref5 = new ActionReference();
    var idClr = charIDToTypeID( "Clr " );
    var idClrs = charIDToTypeID( "Clrs" );
    ref5.putProperty( idClr, idClrs );
    desc6.putReference( idnull, ref5 );
	executeAction( idRset, desc6, DialogModes.NO );
	}


function createWhiteAndAdhesiveChannelsThig() {
var idsetd = charIDToTypeID( "setd" );
    var desc62 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref52 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref52.putProperty( idChnl, idfsel );
    desc62.putReference( idnull, ref52 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idNone = charIDToTypeID( "None" );
    desc62.putEnumerated( idT, idOrdn, idNone );
executeAction( idsetd, desc62, DialogModes.NO );

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc63 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
        var desc64 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc64.putString( idNm, "WHITE" );
        var idClrI = charIDToTypeID( "ClrI" );
        var idMskI = charIDToTypeID( "MskI" );
        var idSlcA = charIDToTypeID( "SlcA" );
        desc64.putEnumerated( idClrI, idMskI, idSlcA );
        var idClr = charIDToTypeID( "Clr " );
            var desc65 = new ActionDescriptor();
            var idRd = charIDToTypeID( "Rd  " );
            desc65.putDouble( idRd, 255.000000 );
            var idGrn = charIDToTypeID( "Grn " );
            desc65.putDouble( idGrn, 0.000000 );
            var idBl = charIDToTypeID( "Bl  " );
            desc65.putDouble( idBl, 0.000000 );
        var idRGBC = charIDToTypeID( "RGBC" );
        desc64.putObject( idClr, idRGBC, desc65 );
        var idOpct = charIDToTypeID( "Opct" );
        desc64.putInteger( idOpct, 50 );
    var idChnl = charIDToTypeID( "Chnl" );
    desc63.putObject( idNw, idChnl, desc64 );
executeAction( idMk, desc63, DialogModes.NO );

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc66 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
        var desc67 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc67.putString( idNm, "ADHESIVE" );
        var idClrI = charIDToTypeID( "ClrI" );
        var idMskI = charIDToTypeID( "MskI" );
        var idSlcA = charIDToTypeID( "SlcA" );
        desc67.putEnumerated( idClrI, idMskI, idSlcA );
        var idClr = charIDToTypeID( "Clr " );
            var desc68 = new ActionDescriptor();
            var idRd = charIDToTypeID( "Rd  " );
            desc68.putDouble( idRd, 255.000000 );
            var idGrn = charIDToTypeID( "Grn " );
            desc68.putDouble( idGrn, 0.000000 );
            var idBl = charIDToTypeID( "Bl  " );
            desc68.putDouble( idBl, 0.000000 );
        var idRGBC = charIDToTypeID( "RGBC" );
        desc67.putObject( idClr, idRGBC, desc68 );
        var idOpct = charIDToTypeID( "Opct" );
        desc67.putInteger( idOpct, 50 );
    var idChnl = charIDToTypeID( "Chnl" );
    desc66.putObject( idNw, idChnl, desc67 );
executeAction( idMk, desc66, DialogModes.NO );

var idslct = charIDToTypeID( "slct" );
    var desc69 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref53 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idCMYK = charIDToTypeID( "CMYK" );
        ref53.putEnumerated( idChnl, idChnl, idCMYK );
    desc69.putReference( idnull, ref53 );
executeAction( idslct, desc69, DialogModes.NO );

}



function getNewHeight() {
		var new_height = docRef.height + 0.125
		alert(  'height: ' + docRef.height  + ' new_height:' + new_height ) ;
}


function resizeCanvasToNewHeight() {
		docRef.resizeCanvas( docRef.width , docRef.width + 0.125 )
}


function crosshairs() {
	setColors() 
	// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref1.putProperty( idChnl, idfsel );
    desc2.putReference( idnull, ref1 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idNone = charIDToTypeID( "None" );
    desc2.putEnumerated( idT, idOrdn, idNone );
executeAction( idsetd, desc2, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref2.putProperty( idChnl, idfsel );
    desc3.putReference( idnull, ref2 );
    var idT = charIDToTypeID( "T   " );
        var desc4 = new ActionDescriptor();
        var idTop = charIDToTypeID( "Top " );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idTop, idRlt, 0.000000 );
        var idLeft = charIDToTypeID( "Left" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idLeft, idRlt, 4.000000 );
        var idBtom = charIDToTypeID( "Btom" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idBtom, idRlt, 9.000000 );
        var idRght = charIDToTypeID( "Rght" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idRght, idRlt, 5.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc3.putObject( idT, idRctn, desc4 );
executeAction( idsetd, desc3, DialogModes.NO );

// =======================================================
var idFl = charIDToTypeID( "Fl  " );
    var desc5 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
    var idFlCn = charIDToTypeID( "FlCn" );
    var idFrgC = charIDToTypeID( "FrgC" );
    desc5.putEnumerated( idUsng, idFlCn, idFrgC );
    var idOpct = charIDToTypeID( "Opct" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc5.putUnitDouble( idOpct, idPrc, 100.000000 );
    var idMd = charIDToTypeID( "Md  " );
    var idBlnM = charIDToTypeID( "BlnM" );
    var idNrml = charIDToTypeID( "Nrml" );
    desc5.putEnumerated( idMd, idBlnM, idNrml );
executeAction( idFl, desc5, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc6 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref3 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref3.putProperty( idChnl, idfsel );
    desc6.putReference( idnull, ref3 );
    var idT = charIDToTypeID( "T   " );
        var desc7 = new ActionDescriptor();
        var idTop = charIDToTypeID( "Top " );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc7.putUnitDouble( idTop, idRlt, 4.000000 );
        var idLeft = charIDToTypeID( "Left" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc7.putUnitDouble( idLeft, idRlt, 0.000000 );
        var idBtom = charIDToTypeID( "Btom" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc7.putUnitDouble( idBtom, idRlt, 5.000000 );
        var idRght = charIDToTypeID( "Rght" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc7.putUnitDouble( idRght, idRlt, 9.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc6.putObject( idT, idRctn, desc7 );
executeAction( idsetd, desc6, DialogModes.NO );

// =======================================================
var idFl = charIDToTypeID( "Fl  " );
    var desc8 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
    var idFlCn = charIDToTypeID( "FlCn" );
    var idFrgC = charIDToTypeID( "FrgC" );
    desc8.putEnumerated( idUsng, idFlCn, idFrgC );
    var idOpct = charIDToTypeID( "Opct" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc8.putUnitDouble( idOpct, idPrc, 100.000000 );
    var idMd = charIDToTypeID( "Md  " );
    var idBlnM = charIDToTypeID( "BlnM" );
    var idNrml = charIDToTypeID( "Nrml" );
    desc8.putEnumerated( idMd, idBlnM, idNrml );
executeAction( idFl, desc8, DialogModes.NO );
}



