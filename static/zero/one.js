// shell and cube core logic

/*
 * 2016-04-11 
 * core logic for cube flow
 * 
 * 
 * 
 * 
 */

//var baseUrl = 'http://www.connshelldev.com/';
var baseUrl = 'http://www.connshelldev.com:8000/';
//var baseUrl = 'http://www.cubeflow.net/';
var cube_selected = '';
var pre_con_selected = '';
var seleted_shell_html = '';


//################################################################################################################
/*var doAutoTest = function(){
	
	var search_type = "A";
	
	
	var search_keyword = $("#auto_test").val();
	
	//console.log(search_keyword);
	$.ajax({
		type: "POST",
	   	url:baseUrl+'intershell/zero/search/',
	   	data:{"search_type":search_type, "search_keyword":search_keyword},
	   	dataType: "JSON",
	   	success:function(data){
	       	$(".uk-autocomplete").source(data);
	       	},
	    error:function(){
	    	alert('autocomplete error');
	    }
	});
};*/

//################################################################################################################
// Common module 
var doClearModule = function(target_module){
	$('#' + target_module).remove();
	$('#' + target_module+'_css').remove();
	$('#' + target_module+'_script').remove();
};

var doHideModule = function(target_module){
	$('#' + target_module).css("visibility","hidden");
};

// ### do reload static (script)

var doStaticReload = function(module){
	var module_html= module + '_static.html';
	var module_script= '#'+ module + '_script';
	var module_css= '#' + module + '_css';
    
	$.ajax({
		type: "GET",
	  	url:baseUrl+'intershell/html/' + module_html,
	   	//dataType: "JSON",
	   	success:function(data){
			$(module_script).remove();
			$(module_css).remove();
            
	       	$("head").append(data);
	    },
	    error:function(){
	        alert('static file load error!! ');
	    }
	});
};

//################################################################################################################
// act like Module Static file  LOADED!!!!
//################################################################################################################

var doLikeLoadShellStatic = function(){
        $("#conContent").on("click",".shell-li", doSelectShell);
		$(".cube-ul").on("click",".flow-shell-act", doFlowShell);

		// flow modal action
		$(".cube-ul").on("click",".flow-shell", doRetrieveShellFlow);
		$(".cube-ul").on("click",".shell-meta-div-show", doShellMeta);
		$(".cube-ul").on("click",".shell-detail-modal", doModalShell);
		$(".cube-ul").on("click",".shell-detail-area", doMetaShellArea);
        
		$("#conContent").on({
		    mouseenter: function () {
				var param  = $(this).attr("value").split("_");
				$("#modal_flow").attr("value", $(this).attr("value"));

				if( !$(this).hasClass("shell-selected") ){
					$(this).find("#shell_action").css("visibility","visible");
        			$(this).css("background-color","#e1e8ef");
				}
		    },
		    mouseleave: function () {
				if( !$(this).hasClass("shell-selected") ){
					$(this).find("#shell_action").css("visibility","hidden");
        			$(this).css("background-color","");
				}
		    }
		}, ".shell-li");
};


//################################################################################################################
// init Module
//################################################################################################################

var doInitCubeSticky = function(initype){
	// stop and redo next time
	/*if ( inittype = 'T') {
		UIkit.sticky('.sticky-cube', {
			offset: 100,
			bottom: true
		});
	} else if (inittype = 'F'){
		UIkit.sticky('.sticky-cube', {
			offset: 205,
			bottom: true
		});
	} else if (inittype = 'Z'){
		UIkit.sticky('.sticky-cube', {
			offset: 105,
			bottom: true
		});
	}
	*/
};
//################################################################################################################
//login join
//################################################################################################################

var doJoinArea = function(){
	$("#conContent").css("display", "none");
	$("#mainLoginJoin").css("display", "block");

};

var doJoinControl = function(){
	alert("doJoinControl");
};

var doLoginArea = function(){
	$("#conContent").css("display", "none");
	$("#mainLoginJoin").css("display", "block");
};


//################################################################################################################
//Click Event 

// 3. connect 
var doConnectUser = function(e){
	var target_id = $(this).attr("value");
	
	var remove_target = $(this).parents("li");
	//alert(target_id);
	
	$.ajax({
		type: "POST",
	   	url:baseUrl+'intershell/zero/connect/U/',
	   	data:{"target_id":target_id},
	   	//dataType: "JSON",
	   	success:function(data){
	   			remove_target.remove();
	       		alert(data);
	       	},
	    error:function(){
	    	alert('connect user failed!');
	    }
	});
};




//################################################################################################################
//### RETRIEVE shell and Cube

var doRetrieveShell = function (event, M_shell_type){
	
	var selected = $(this);
	var cube_id = selected.attr("value");
	
	if ( selected.attr("value") != 'select' )
	{
		$.ajax({
	   		type: "POST",
	   		url:baseUrl+'intershell/zero/shell/' + M_shell_type,
	   		data:{"cube_id":cube_id},
	   		//dataType: "JSON",
	   		success:function(data){

	           	selected.empty(); 
	           	selected.append(data);
	           	
	           	selected.removeClass("shell-div");
				selected.addClass("shell-list-div");
                
	        },
	        error:function(){
	            alert('error');
	        }
	   	});
	}
	else
	{
		event.stopPropagation();
	}
};

var doRetrieveShellList = function (target, M_shell_type){
    // ##### DEFAULT Shell retrieve logic
    

	var cube_id = target.attr("value");
	
    var target_list = target.find(".target-list").attr("value");
    var shell_mode = target.find(".shell-mode").attr("value");
    var exist_hidden_shell;
	$.ajax({
		type: "POST",
	  	url:baseUrl+'intershell/zero/shell/'+ M_shell_type +'/',
	   	data:{"cube_id":cube_id},
	   	//dataType: "JSON",
	   	success:function(data){
	       	//target.empty();
            
	       	target.append(data);
            
            //hash tag 
            doHashDisplay(event, target);
            
            exist_hidden_shell = 0;; 
            
            if (shell_mode == 'M'){

                target.find(".shell-li").each(function(index){
                    $(this).addClass('shell-visible');
                    $(this).css("display", "block");
                });
            } else if (shell_mode == "MC"){

            } else if ( target_list.length != 0 && shell_mode != "O"){

                target_list = target_list.split("_");   
                //display SHELL LIST
                target.find(".shell-li").each(function(){
                    var shell_li = $(this).attr("value");                
                    shell_li = shell_li.split("_");

                    if ( target_list.indexOf( shell_li[1] ) != -1 ){
                        $(this).addClass('shell-visible');
                        $(this).css("display", "block");
                    }else{	
                        $(this).addClass('shell-hidden');
                        $(this).css("display", "none");
                        exist_hidden_shell = 1; 
                    }
                });
            }else if( target_list.length == 0 ){
                target.find(".shell-li").each(function(index){
                    if (index<3){
                        $(this).addClass('shell-visible');
                        $(this).css("display", "block");
                    }else{
                        $(this).addClass('shell-hidden');
                        $(this).css("display", "none");
                        exist_hidden_shell = 1; 
                    }
                });  
            }else{
                alert("doRetrieveShellList- no if ");
            }
            
            // ##### when retrieve shell then Check the hidden shell 
            var target_cube_li = target.parents(".cube-li");

            if(exist_hidden_shell == 1){
                //target_cube_li.find(".cube-show-all").css("display", "block");
            }else{
                target_cube_li.find(".cube-show-all").remove();
            }
            
	    },
	    error:function(){
	        //alert('shell list retrieve error');
	    }
	});
};



var doShellMode = function (M_shell_type){
    //alert("doShellMode");
	var target;
    
    $(".M-Cube").find( ".shell-div" ).each(function( index ) {
		target = $(this); 
		doRetrieveShellList(target, M_shell_type);
	});
    //doRetrieveSelectShell();
};

var doShellModeTarget = function (target, M_shell_type){
    //alert (target.html() );
    var shell_target;
    
	target.find(".shell-div").each(function( index ) {
        shell_target = $(this);
		doRetrieveShellList(shell_target, M_shell_type);
	});
};



var doDisplayCube = function(target_cube_li, display_type){
   // make hide show shell by type
    if(display_type == 'O'){ //##ONE CUBE
        target_cube_li.find("article").removeClass("cf-panel-box-secondary");
        target_cube_li.find("article").addClass("cf-panel-box-secondary-selected");
        
        target_cube_li.find(".cube-hide-shell").show();
        //target_cube_li.find(".show-shell").remove();
        
        target_cube_li.find("article").addClass("cube-selected");
        doMetaCubeArea( target_cube_li.find("article") );
        
        //target_div.find(".show-shell").css("display","block");
        
    }else{
        alert('there is no type code');
    }
    
};

var doCubeMode = function(cube_type){//call Shell!!!!!!!!!
    
    if ( cube_type == 'T' ){// timeline
		doShellMode('F');
	}
	else if ( cube_type == 'U' ){// someone cube list
		doShellMode('F');
	}
	else if ( cube_type == 'M' ){// Create and add shell to exist cube
		doShellMode("M");
	}
	else if ( cube_type == 'S'){// Search
		doShellMode("F");
	}
	else if (cube_type == 'O'){
		doShellMode("R");
	}
	else if ( cube_type == 'H' ){//create cube and retrieve one cube
		doShellMode("F");
	}  
};

var doRetrieveCube = function (){
    // by Flow list one cube select 
	console.log("what the doRetrieveCube.... ");
    
	var target = $(this);
	var total_id = $(this).attr("value");
	var target_total_id = total_id.split("_");
	
	//alert (target_total_id[0]);
	if( $(this).hasClass('selected-flow') == true ){
		$(this).removeClass("selected-flow");
		$(this).parents('li').find('#M_cube').remove();
		target.parents('li').find('.flow-cube-div').css("display","none");
	}
	else{		
		$.ajax({
			type: "POST",
		  	url:baseUrl+'intershell/zero/cube/H/' + target_total_id[0] + '/',
		   	
		   	//dataType: "JSON",
		   	success:function(data){
		      	//console.log (data);	
		      	target.addClass('selected-flow');
		      	target.parents('li').find('.flow-cube').append(data);
		      	target.parents('li').find('.flow-cube-div').css("display","block");
		    },
		    error:function(){
		        alert('M_FLOW - cube retrieve error');
		    }
		});
	}
};

var doRetrieveCubeUser = function(){
	//user profile page 
	window.location.href = baseUrl + 'intershell/zero/cube/U/'+ $(this).attr("value");
};


var doRetrieveCubeList = function (target_user_id, target_div){
    //for Select Cube from My Cube
    //M_modal.html
	var scroll_seq = "";
    
	$.ajax({
		type: "POST",
		url:baseUrl+'intershell/zero/cube/MC/0/',
	 	dataType: "html",
	 	success:function(html){
            target_div.append(html);
            doShellMode("M"); 
            doExtendMode("H");
            //doStaticReload('M_cube');
        },
        error:function(){
           alert(' doRetrieveCubeList - Retrive error');
        }
	});
};


var doRetrieveCubeOneH = function (tcube_id, cube_type, target_div ){
    
	$.ajax({
		type: "GET",
	  	url:baseUrl+'intershell/zero/cube/OH/' + tcube_id + '/',
	   	//dataType: "JSON",
	   	success:function(data){
	      	//console.log (data);	 
	      	if ( cube_type == 'create'){
	      		target_div.append(data);
	            
	            doShellMode("F"); 
	            doExtendMode("H");
	            
	            doDisplayCube(target_div.find(".cube-li"), "O");//cone cube	
	      	}else if  ( cube_type == 'update'){
	      		
	      		target_div.empty();
	      		target_div.append(data);
	      		doShellMode("F"); 
	            doExtendMode("H");
	      	}
	      	
             
	    },
	    error:function(){
	        alert('retrieve created cube ERROR!!');
	        return;
	    }
	});
};

//################################################################################################################
// #### infinite scroll
// Each time the user scrolls
var doInfiniteScrollCube = function() {
    
	var win = $(window);
	if ($(document).height() - win.height() == win.scrollTop()) {
        //$('#loading').show();
        
        var scroll_seq = parseInt( $("#cube_scroll").attr("value") );
        scroll_seq = scroll_seq +1;
        
		$.ajax({
            type: "POST",
			url:baseUrl + 'intershell/zero/cube/T/0/',
			dataType: 'html',
			data:{"scroll_seq":scroll_seq},
			success: function(html) {
                //alert("after ajax");
                
                $("#cube_scroll").attr("value", scroll_seq) ;
                $(".cube-ul").append(html);  
                
                $(".cube-ul").find(".cube-li").each(function(){
                    if( $(this).attr("scrollseq") == scroll_seq ){
                        var target_shell_div = $(this).find(".shell-div");
                        doRetrieveShellList( target_shell_div, 'F');    
                        //active sticky
                        var height_top =  $("#M_TopControl").outerHeight(true);
                        //UIkit.sticky( $(this).find(".sticky-cube"), {top:height_top}  );
                        doInitCubeSticky('C');
                    }
                });

                //$('#loading').hide();
			}
		});
    }
};

var doNotiPage = function(){
	alert("test for noti ");
};


//################################################################################################################
// ### retrieve CUBE SHELL
// ## control retrieve data 
//################################################################################################################


var doCubeShowAll = function( event ){
    event.stopPropagation();
    
    if ( $(this).hasClass("show-toggle") ) {
        $(this).removeClass("show-toggle");
        
        $(this).parents(".cube-li").find(".shell-li").each(function(){
            if($(this).hasClass("shell-hidden")){
               $(this).css("display", "block");         
            }
        });
        $(this).html("close shell")
        
    }else{
        $(this).addClass("show-toggle");
        
        $(this).parents(".cube-li").find(".shell-li").each(function(){
            if($(this).hasClass("shell-hidden")){
               $(this).css("display", "none");         
            }
        });
        $(this).html("show all")
    }
    //doClickCube(event);
    //doSelectCube( $(this).parents(".uk-article") );
};






//################################################################################################################
// SELECT SHELL CUBE
//################################################################################################################
var doSelectShell = function(event){    
	event.stopPropagation();
    //selected shell 

    var selected_total_id = $(this).attr("value");

    var selected_shell = $(this).parents(".shell-li");
   	var selected_CN_shell = $(this).parents(".CN-shell-li");

   	selected_total_id = '#'+selected_total_id;

   	if ( selected_CN_shell.attr("value") === undefined ){

		if( selected_shell.hasClass("shell-selected") ){
	        selected_shell.removeClass("shell-selected");
	        selected_shell.find("#shell_action").css("visibility","hidden");
	        
	    }else{
	    	selected_shell.addClass("shell-selected");        
	        selected_shell.find("#shell_action").css("visibility","visible");
	    }  		

   	}else{
   		selected_shell = selected_CN_shell;
   	}


    if( $(".M-Nav").find(selected_total_id).length != 0  ){
        doRemoveNav(event);
    }else{
        doAddNav(selected_shell);
    }
    
    
    
};



var doClickCube = function(event){
	event.stopPropagation();

	var target_article = $(event.currentTarget);

	if( target_article.hasClass("cube-on-update") ){
		return false;
	}else if ( $("#TC_cube_mode").hasClass("cube-on-update")){
		//UIkit.modal.alert('now update is process. finish update!!');
		return false; 
	}

	if( target_article.hasClass("cube-selected") ){

        target_article.removeClass("cube-selected");

        target_article.addClass("cf-panel-box-secondary");
		target_article.removeClass("cf-panel-box-secondary-selected");
		target_article.find("#cube_title").removeClass("uk-text-bold");	

		$("#M_TopControl").find(".cube-selected").css("display","none");
		$("#M_TopControl").find(".cube-not-selected").css("display","block");

		$("#TC_cube_mode").attr("value", "");
		$("#TC_cube_mode").removeClass("cube-seleted");

    }else{
		
    	$("#conContent").find(".cube-selected").removeClass("cf-panel-box-secondary-selected");
    	$("#conContent").find(".cube-selected").addClass("cf-panel-box-secondary");
    	$("#conContent").find(".cube-selected").removeClass("cube-selected");

		target_article.addClass("cube-selected");

		//display
		target_article.addClass("cf-panel-box-secondary-selected");
		target_article.removeClass("cf-panel-box-secondary");
		target_article.find("#cube_title").addClass("uk-text-bold");	


		$("#M_TopControl").find(".cube-not-selected").css("display", "none");
		$("#M_TopControl").find(".cube-selected").css("display","block");
		
		$("#M_TopControl").find("#btnUpdate").attr("value",target_article.attr("value") );
		$("#M_TopControl").find("#btnUpdateForm").attr("value",target_article.attr("value") );
		$("#M_TopControl").find("#btnAddNewShell").attr("value",target_article.attr("value") );

		//top control cube mode 
		$("#TC_cube_mode").attr("value", target_article.attr("value") );
		$("#TC_cube_mode").addClass("cube-seleted");
	}
	
	//doSelectCube( $(this) );
};

var doClickDOM = function(){

	var target_article =  '#article_'+ $("#TC_cube_mode").attr("value");
	target_article = $(target_article);

	if( target_article.hasClass("cube-on-update") ){
		return false;
	}

	if( $("#TC_cube_mode").hasClass("cube-seleted")  ){
		target_article.removeClass("cube-selected");

        target_article.addClass("cf-panel-box-secondary");
		target_article.removeClass("cf-panel-box-secondary-selected");
		target_article.find("#cube_title").removeClass("uk-text-bold");	

		$("#M_TopControl").find(".cube-selected").css("display","none");
		$("#M_TopControl").find(".cube-not-selected").css("display","block");

		$("#TC_cube_mode").attr("value", "");
		$("#TC_cube_mode").removeClass("cube-seleted");

	}
};

var doRetrieveSelectShell = function(event){
    // Nav Act target display cube list

    $("#M_Cube").find(".shell-li").each(function(){
        $(this).removeClass("shell-selected")
        $(this).find("#shell_action").css("visibility","hidden");
    });
    
    var nav_shell_list = [];
	nav_shell_list = $(".nav-ul").find(".nav-li")
			.map(function(){
				return $(this).attr("id");
				})
			.get();
    
    var target_shell_id;
    var target_shell_div;

    for (var i=0;i < nav_shell_list.length;i++){
		target_shell_id = '#' + nav_shell_list[i];
        target_shell_div = $("#conContent").find(target_shell_id);
        
        target_shell_div.addClass("shell-selected");
        target_shell_div.find("#shell_action").css("visibility","visible");
        
        //target_shell_div.parents(".uk-article").addClass("cube-selected");
        //target_shell_div.parents(".uk-article").removeClass("cf-panel-box-secondary");
        //target_shell_div.parents(".uk-article").addClass("cf-panel-box-secondary-selected");  
        
        //doMetaCubeArea( target_shell_div );
	}
};

var doMetaShellArea = function(event){
    event.stopPropagation();
    
    doCloseMetaShellArea();    
    
    var target_shell =  $(event.currentTarget).parents(".shell-li");
    var target_cube = $(event.currentTarget).parents(".cube-li");
    
    var meta_id =  $(event.currentTarget).attr("value");
    var meta_total_id = meta_id.split("_");
    
    meta_id = 'meta_shell_' + $(event.currentTarget).attr("value");

    
    var div_overlay = $(".overlay-div-dup").clone();
    div_overlay.attr("id", meta_id);
    div_overlay.removeClass("overlay-div-dup");
    div_overlay.addClass("active-shell-meta-area");
    
    div_overlay.css("display", "block");
    
    $("#conContent").append(div_overlay);
    meta_id = "#"+meta_id;
    
    //alert (meta_id);
    
    $(meta_id).css("position", "absolute" );
    $(meta_id).offset({ top : target_shell.offset().top + target_shell.height() + 5 , left: target_cube.offset().left - 5  });
    $(meta_id).css("width", target_cube.width() );
    //$(meta_id).css("min-height", '200' );
    
    //focus out in with style="outline:none"
    $(meta_id).attr("tabindex", -1).focus();
    $(meta_id).on("focusout", function(){ 
        doCloseMetaShellArea();    
    });
    
    $.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/flow/S/'+ meta_total_id[0] + '/' + meta_total_id[2] + '/' ,
		data:{"scroll_seq":"0"},
		success:function(data){
			$(meta_id).find(".slider-ul").append(data);     
            UIkit.slider( $(meta_id) );
            $(meta_id).find('.shell-div').each(function(){
                doRetrieveShellList($(this), 'F');    
                $(this).addClass("cf-scrollable-box");
            });
		},
		error:function(){
			alert('## error shell MetaArea !!! ##');
		},
	});	
};


var doCloseMetaShellArea = function(){
    $(".active-shell-meta-area").remove();
};

var doMetaCubeArea = function(target_div){
    var target_cube = target_div.parents(".cube-li");    
    var meta_cube_id =  target_cube.attr("value");
    
    meta_cube_id = '#meta_cube_' + meta_cube_id
    
    $(meta_cube_id).addClass("active-cube-meta-area");
    $(meta_cube_id).css("display", "block");
    
    //$(meta_cube_id).css("height", '100' );
};

var doRemoveMetaCubeArea = function(target_div){
    var target_cube = target_div.parents(".cube-li");    
    var meta_cube_id =  target_cube.attr("value")
    meta_cube_id = '#meta_cube_' + meta_cube_id
    
    $(meta_cube_id).removeClass("active-cube-meta-area");
    $(meta_cube_id).css("display","none");
};


var doActiveTopControlSticky = function(event){
    $(this).addClass("cf-panel-box-secondary-selected");
    $(this).removeClass("cf-panel-box-secondary");

	var top_height =  $("#M_TopControl").css("height");

	var topcontrol_type = $("#topcontrol_type").attr("value");

	if ( topcontrol_type == "C"){
		doInitCubeSticky('C');
	} else if ( topcontrol_type == "Z"){
		doInitCubeSticky('Z');
	}
};

var doActiveCubeSticky = function(event){
    $(this).addClass("cf-panel-box-secondary-selected");
    $(this).removeClass("cf-panel-box-cube");
};

var doInactiveCubeSticky = function(event){
    $(this).removeClass("cf-panel-box-secondary-selected");
    
};


//####################################################################################################
// HASHTAG & HASHDIR
//####################################################################################################

var doHashDisplay = function(event, target_div){
    var cube_id = target_div.attr("value");

    //alert (target_div.html());
    target_div.find(".shell").each(function( index ) {
        var shell_text = $(this).text();
        var total_id = $(this).parents(".shell-li").attr("value");
        
        if(!shell_text.match(/#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))#/g)) { //arabic support
			shell_text = shell_text.replace(/#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g,'<span class="hashtag" style="cursor:pointer" >#$1</span>');
		}else{
			shell_text = shell_text.replace(/#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g,'<span class="hashtag" style="cursor:pointer" >#$1</span>');
		}
        $(this).empty();
        $(this).append(shell_text);

        $(this).on("click",".hashtag", doSearchTag );
    });

};

var doAddHashdir = function(event){
	event.stopPropagation();

	var target_cube_li = $(this).parents(".cube-li");
	var total_id = $(this).attr("value").split("_");  // cube_id / con_id / hashcon_id 
	//alert (total_id)
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/hash/CD/',
   		data:{"cube_id":total_id[0], "hashcon_id":total_id[2] },
   		success:function(data){
            target_cube_li.find(".hashdir-div").replaceWith(data);
        },
        error:function(){
            //alert('error retrive extend!');
        },
   	});

};

var doRemoveHashdir = function(event){
	event.stopPropagation();

	var target_hashdir_li= $(this).parents(".hashdir-li");
	var target_hashcon_id  = target_hashdir_li.find(".hashdir-list").attr("value"); // cube_id / con_id / hashcon_id 

	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/hash/RD/',
   		data:{"hashcon_id":target_hashcon_id },
   		success:function(data){
            target_hashdir_li.remove();
        },
        error:function(){
            //alert('error retrive extend!');
        },
   	});

}

var doChangeHashdir = function(event){
	
	var dataSet = {"dataset":"update_hashdir"};
	var hashcon_id_list = []; 
	var hashcon_id_list_json = [];
	var hashcon_seq=0;

	$(this).find('.hashdir-list').each(function(){ // changed ul each li 
		item = {};
	    item ["hashcon_id"] = $(this).attr("value");
	    item ["hashcon_seq"] = '' +hashcon_seq;

	    hashcon_id_list_json.push(item);
	    hashcon_seq++;
	});

	$.extend(dataSet, {"hashcon_list" : hashcon_id_list_json }) ;
	
	//alert ( JSON.stringify( dataSet ) ) ;

	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/hash/UD/',
   		data:JSON.stringify( dataSet ) ,
   		dataType: "JSON",
   		success:function(data){
   			//alert(data);        
   		},
        error:function(){
            alert('doUpdateHashDir - ajax error');
        }
   	});

};



var doExtendMode = function(ex_type){
    // extend have to change hashmode
    var target;
    var pcube_id;
    var return_data; 
    
    $(".M-Cube").find( ".hash-div" ).each(function( index ) {
		target = $(this); 
        pcube_id = $(this).attr("value");
		doRetrieveHashtagList(target, pcube_id  );
	});
};

var doRetrieveHashtagList = function(target, cube_id){

	$.ajax({
   		type: "POST", 
   		url:baseUrl+'intershell/zero/hash/H/',
   		data:{"cube_id":cube_id},
   		success:function(data){
            target.append(data);
        },
        error:function(){
            //alert('error retrive extend!');
        },
   	});
};



//####################################################################################################
//Navigation
//####################################################################################################

var doAddNav = function(target_shell){ 
    var target_id = target_shell.attr("id");
    var target_text = target_shell.find(".shell").html();
	var target_scroll = target_shell.attr("id");
	var show_text ="";
	var showChar = 40;
    var target_type = "" ;
    

    if ( target_shell.hasClass("shell-li") ){
        target_type = "C";
    }else if( target_shell.hasClass("CN-shell-li") ) {
        target_type = "C";
    }else if( $(event.currentTarget).hasClass("hashtag") ) {
        target_type = "H";
    }
    
	if(target_text.length > showChar) {
        show_text = target_text.substr(0, showChar);

    }else{
        show_text = target_text;
    }
    
    //### flow nav check
	/*var target_html =  "<li class='nav-li' id="+ target_id +" value = '" + target_type  +"'  ><span class='cf-M-nav-close' uk-icon='icon: more; ratio:0.8'></span><span class='shell-tooltip uk-margin-small-left' uk-tooltip='pos:bottom' title='" + target_text +
		"'  value='"+ target_text +	"' ><a href='#"+ target_scroll + "'  value='" + target_id + "' >" + show_text + "</a></span></li>";*/
    //cf-M-nav-close close connect
    

	var target_nav_html = $(".nav-ul").find(".nav-li-dup").clone();

	//alert( $(".nav-ul").append(target_nav_html);

	$(".nav-ul").find('.nav-li-dup').last().addClass("nav-li").attr("id", target_id );

	target_id = '#' + target_id;
	var target_nav_li = $(".nav-ul").find(target_id);

	target_nav_li.removeClass("nav-li-dup");
	target_nav_li.css("display", "block");

	target_nav_li.find(".nav-span").html( show_text );
	target_nav_li.find(".nav-span").attr("value", target_text );
	target_nav_li.find(".nav-span").attr("title", target_text );

	//$(".nav-ul").append(target_nav_html).css("display", "block");

	target_id	 = '#' + target_id ;

    $.session.set('nav_act_html', $("#nav_ul").html() );
};

var doRemoveNav = function(event){
    event.stopPropagation();
    
	var target_id;
	var target_div;
    
	if( $(event.currentTarget).hasClass('cf-M-nav-close')  ){
		target_id = $(event.currentTarget).parents("li").attr("id");
		$(event.currentTarget).parents("li").remove();
		
        target_div = $("#M_Cube").find("#" + target_id + "");
        
        if ( target_div.find(".uk-icon-check-square") ){
            target_div.removeClass("shell-selected");
            $(this).find("#shell_action").css("visibility","hidden");
            target_div.css("background-color","");
        }
	}else{
		target_id = $(event.currentTarget).attr("value");
		$("#M_Nav").find("#"+target_id+"").remove();
	}

    $.session.set('nav_act_html', $("#nav_ul").html() );
};

var doChangeNav = function(event){
	// develpe 필요
	var dataSet = {"dataset":"update_hashdir"};
	var hashcon_id_list = []; 
	var hashcon_id_list_json = [];
	var hashcon_seq=0;

	$(this).find('.hashdir-list').each(function(){ // changed ul each li 
		item = {};
	    item ["hashcon_id"] = $(this).attr("value");
	    item ["hashcon_seq"] = '' +hashcon_seq;

	    hashcon_id_list_json.push(item);
	    hashcon_seq++;
	});

	$.extend(dataSet, {"hashcon_list" : hashcon_id_list_json }) ;
	
	//alert ( JSON.stringify( dataSet ) ) ;

	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/hash/UD/',
   		data:JSON.stringify( dataSet ) ,
   		dataType: "JSON",
   		success:function(data){
   			//alert(data);        
   		},
        error:function(){
            alert('doUpdateHashDir - ajax error');
        }
   	});

};

var doSaveNav = function(event){
    
    var dataSet = {};
    
    var nav_list;
	var nav_list_JSON = [];
    
    
    if ( $(".new-nav").val() == '' ) {
        alert("nav name is empty" );
        return 
    }

    $(".nav-li").each(function(){
        //type shell 
        nav_list = $(this).attr("id").split("_"); 
        
        $(this).find("svg").remove();

        item = {};
        item["target_type "] = $(this).attr("value");
	    item["target_id "] = nav_list[1] ; //con_id target is shell 
        item["html"] = $(this).clone().wrapAll("<div/>").parent().html();
        
        nav_list_JSON.push(item);
    });

    if ( nav_list_JSON.length === 0  ){
        alert("nothing to save!!");
        return;
    }
    
    
    $.extend(dataSet, {"nav_id" : $(".mynav-selected").attr("value") }) ;
    $.extend(dataSet, {"nav" : $(".new-nav").val() }) ;
    $.extend(dataSet, {"nav_list_JSON" : nav_list_JSON }) ;
    
    //alert ( JSON.stringify( dataSet ) ) ;
    
    $.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/nav/create/',
   		data:JSON.stringify( dataSet ),
   		dataType: "JSON",
   		success:function(data){

            doRetrieveNav(event, 'retrieveH');
            doEmptyNavAct();
        },  
        error:function(){
            alert('doSaveNav - ajax error');
        }
   	});
    
};

var doRetrieveNavSession = function(event){

    if( $.session.get('nav_act_html') ){
		$("#nav_ul").find(".nav-li").each(function(){ $(this).remove(); } ) ;
		$("#nav_ul").append($.session.get('nav_act_html'));
        //doRetrieveSelectShell();
	}
};

var doRetrieveNav = function(event, M_Nav_type){
    var target_user_id = $(this).attr("value"); // user clicked
    
    $.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/nav/' + M_Nav_type +'/',
   		data:{"user_id":target_user_id},
   		success:function(data){
           	if(M_Nav_type == "retrieveH"){
                $(".my-nav-ul-div").remove();
                $(".my-nav-div").append(data);
            }else if (M_Nav_type =="retrieveM"){
                $("#rsideControl").append(data);
            }
            
            doRetrieveSelectShell();
        },  
        error:function(){
            alert('doRetrieveNav - ajax error');
        }
   	});	
    
};



var doSaveMyNav = function(){
	alert ("doSaveMyNavSort");

	//$(".my-nav-ul")

};


var doRetriveNavAct = function(event){
    //My Nav list CLICKED!!!

    doEmptyNavAct();

	$(".mynav-check").removeClass("uk-display-inline")
	$(".mynav-check").css("display", "none")
    $(this).find(".mynav-check").css("display", "block")
    $(this).find(".mynav-check").addClass("uk-display-inline")
    
    $(".uk-text-bold").removeClass("uk-text-bold");
    $(this).find(".mynav").addClass("uk-text-bold")

    $(".mynav-selected").removeClass("mynav-selected");
    $(this).addClass("mynav-selected");
    
    //$("#new_nav").attr( "text", $(this).text() );
    $("#new_nav").val( $(this).find('.mynav').text()  );
    
    var append_html = $(this).find(".my-nav-html").text();

    var append_html2 = $.parseHTML(append_html);
    $(".nav-ul").append(append_html2);

    $(".shell-tooltip").each(function(event){
    	$(this).attr("title",$(this).attr("value"));
    });

    doRetrieveSelectShell();
};

var doEmptyNavAct = function(){
    
    var target_id;
	$(".mynav-selected").find(".mynav-check").removeClass("uk-display-inline")
    $(".mynav-selected").find(".mynav-check").css("display", "none");
    $(".uk-text-bold").removeClass("uk-text-bold");
    $(".mynav-selected").removeClass("mynav-selected");

	$("#new_nav").val("");

    $(".nav-li").each(function(event){
        target_id = $(this).attr("id");
        
		$(this).remove();
        target_div = $("#M_Cube").find("#" + target_id+ "");
        target_div.removeClass("shell-selected");
        target_div.css("background-color","");
    });
    
    $.session.set('nav_act_html', $("#nav_ul").html() );
};


var doRemoveMyNav= function(event){
	event.stopPropagation();
	var target = $(this);
	UIkit.modal.confirm('Do you really watn to delete your Nav?').then(function() {
		 $.ajax({
			type:"POST",
			url:baseUrl + 'intershell/zero/nav/delete/',
			data:{"nav_id":target.attr("value") },
			success:function(data){
				target.parents(".my-nav-li").remove();
			},
			error:function(){
				alert('## error delete nav data!');
			},
		});
	}, function () {

	});

}



//####################################################################################################
// FLOW 
//####################################################################################################
var doRetrieveFlow = function(event){
	event.stopPropagation();
	window.location.href = baseUrl + 'intershell/zero/flow/S/0/' + $(this).attr("value");
};

var doRetrieveShellFlow = function(event){
	event.stopPropagation();
	// 20161116 window.location.href = baseUrl + 'intershell/zero/flow/SF/0/' + $(this).attr("value");
    
    var param_list = $(this).parents(".shell-li").attr("value");
    var param = param_list.split("_");
    
    /*var target_shell = $(this).parents(".shell-li").find(".shell-dup").clone();
    target_shell.addClass("wrap-flow-target");
    target_shell.removeClass("uk-width-9-10");
    
    var wrap_target_shell =  target_shell.wrapAll("<div/>").addClass("wrap-target-shell cf-panel cf-panel-box-secondary");
    */  
    
    var wrap_target_shell = $(this).parents(".shell-li").find(".shell-dup").clone().wrapAll("<div/>").parent();
    
    wrap_target_shell.find(".shell-dup").addClass("wrap-flow-target ");
    wrap_target_shell.addClass("wrap-flow-target selected-shell cf-panel cf-panel-box-secondary");
    
    
    
    
    $.ajax({
        type:"POST",
		url:baseUrl + 'intershell/zero/flow/SF/'+ param[0]+'/'+ param[2] + '/',
		data:{"shell_id":param[2]},
        success:function(data){
            $(".uk-active").removeClass("uk-active");
            $('.nav-li-flow').addClass("uk-active");    
            
            $("#conContent").empty();
            $("#conContent").append(data);

            $(".flow-target-div").append( wrap_target_shell );

            doShellMode("F");
            doExtendMode("H");
		},
		error:function(){
		alert('## error retrive flow data!');
		},
    });
    
};

var doFlowShell = function(e){
	event.stopPropagation();
	
	var param_list = $(this).parents("li").attr("value");
	param = param_list.split("_");
	//param cube_id con_id shell_id
	window.location.href = baseUrl + 'intershell/zero/create/F/0/' + param[2] + '/';
};

var doShellFlowMeta = function(event){
	
	event.stopPropagation();
	
	//alert ( $(this).attr("value"));
	var target = $(this);
	var param_list = target.parents("li.shell-li").attr("value");
	var param = param_list.split("_");
	
	if (target.hasClass("glyphicon-chevron-down") == true ){
		target.removeClass("glyphicon-chevron-down");
		target.addClass("glyphicon-chevron-up");
		
		$.ajax({
			type:"POST",
			url:baseUrl + 'intershell/zero/flow/S/'+ param[0]+'/'+ param[2] + '/',
			data:{"shell_id":$(this).attr("value")},
			success:function(data){
				target.parents('li.shell-li').find(".flow-sub-list").css("display", "block");
				target.parents('li.shell-li').find(".flow-sub-list").append(data);
			},
			error:function(){
				alert('## error retrive flow data!');
			},
		});
	}else{
		target.removeClass("glyphicon-chevron-up");
		target.addClass("glyphicon-chevron-down");
		target.parents('li.shell-li').find("#M_Flow").remove();
		target.parents('li.shell-li').find(".flow-sub-list").css("display", "none");
	}
	
	
};





//################################################################################################################
// SHELL META Action 
var doShellMeta = function(event){
    event.stopPropagation();
    //alert("doShellMeta");
    $(this).parents(".shell-li").find(".shell-meta-div").toggle();
    
};

//################################################################################################################
// CUBE Action 
var doCubeDetail = function(event){
    event.stopPropagation();
    
	var cube_id = $(this).attr("value");
    $("#conContent").empty();
    window.location.href = baseUrl + 'intershell/zero/cube/O/'+ $(this).attr("value");
    
};

var doModalCube = function(event){
    var cube_id = $(this).attr("value");
    $(".modal-cube").attr("value", cube_id);
    
    var modal = UIkit.modal(".modal-cube");
    modal.show();
}


var doCubeDetailModal = function(target){
	var Modal_cube_id = target.attr("value");
	doModalOpen( Modal_cube_id );	
};

var doRetrieveFlower = function(target, cube_id){
	//type : U User
	//alert(cube_id);
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/flow/U/0/0/',
   		data:{"cube_id":cube_id},
   		success:function(data){
   			target.empty();
           	target.append(data);
        },
        error:function(){
            //alert('error retrive flower!');
        },
   	});
};

