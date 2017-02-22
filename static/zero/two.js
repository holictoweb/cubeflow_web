//####################################################################################################
// shell action
//####################################################################################################
var doShellDetail = function(event){
    event.stopPropagation();
    
    var param_list = $(this).attr("value");
	var param = param_list.split("_");
    
    var target_shell = $(this).parents("li").find(".shell-text").text();
    
    $(".target-shell-div").empty();
    $(".target-shell-div").css("display", "block");
    $(".target-shell-div").append(target_shell);
    $(".target-sehll-div").attr("value", param_list);
    
    //stick height에 영향을 줄 수 잇는 부분 확인.
    // ##topcontrol ##cube-title
    $("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );
};

var doShellOverlayDev = function(event ){
	//each shell overlary display
	event.stopPropagation();

	var target_shell_li = $(this).parents(".shell-li");
	target_shell_li.find(".shell-overlay-shell-div").empty();

	target_shell_li.find(".shell-overlay-div").css("display", "block");

	var target_shell_id = target_shell_li.attr("value");
	var param = target_shell_id.split("_");


	$.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/shell/CN/',
		data:{"con_id":param[1], "shell_id":param[2] },
		success:function(data){
			//alert(data);
			var target_shell_id = target_shell_li.find(".shell-overlay-shell-div").append(data).find(".CN-shell-li").attr("value");
			target_shell_li.find(".shell-overlay-next").attr("value", target_shell_id);

		},
		error:function(){
			alert('## error modal shell!!!');
		}, 
	});

};


var doShellOverlayNext = function(event){
	event.stopPropagation();

	var target_shell_li = $(this).parents(".shell-li");
	target_shell_li.find(".shell-overlay-shell-div").empty();

	var target_shell_id = $(this).attr("value");
	var param = target_shell_id.split("_");

	$.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/shell/CN/',
		data:{"con_id":param[1], "shell_id":param[2] },
		success:function(data){
			//alert(data);

			

			var target_shell_id = target_shell_li.find(".shell-overlay-shell-div").append(data).find(".CN-shell-li").attr("value");
			if (typeof target_shell_id === "undefined") {
				alert("no more ");
				target_shell_li.find(".shell-overlay-next").css("display", "none");
			}else{
				target_shell_li.find(".shell-overlay-next").attr("value", target_shell_id);	
			}

			
		},
		error:function(){
			alert('## error modal shell!!!');
		}, 
	});
}


var doShellOverlayClose = function(event){
	event.stopPropagation();

	var target_shell_li = $(this).parents(".shell-li");
	target_shell_li.find(".shell-overlay-div").css("display", "none");

	target_shell_li.find(".shell-overlay-next").css("display", "block");
	target_shell_li.find(".shell-overlay-shell-div").empty();
};

var doModalShellShow = function(){
	event.stopPropagation();

	var target_shell_li = "#"+ $(this).attr("value")
	$(".shell-modal-header").append( $(target_shell_li).html() ).find(".shell-action").css("display", "none");
	
	var param = $(this).attr("value").split("_");
	$.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/search/',
		data:{"shell_id":param[2], "search_type":"S"},
		success:function(data){
			$(".modal-shell-flow-div").append(data);
		},
		error:function(){
			alert('## error modal shell!!!');
		},
	});


	/*
	$.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/search/',
		data:{"shell_id":param[2], "search_type":"T"},
		success:function(data){
			$(".modal-shell-tag-div").append(data);
		},
		error:function(){
			alert('## error modal shell!!!');
		},
	});
	*/

};


var doRemoveFlowTarget = function(event){
	event.stopPropagation();
	
	//alert (  $(this).parent("span").attr("id") );
	
	$(this).parent("span").remove();
	var target_shell = "#" + $(this).parent("span").attr("id");
	var target_shell = "#" + $(this).parent("span").attr("id");

	$(".M-create-form").find(target_shell).remove();	
	target_shell = $(".shell-ul").find( target_shell );
	
	var target_flow_add = target_shell.find(".uk-icon-check-square-o");
	target_flow_add.removeClass("uk-icon-check-square-o");
	target_flow_add.addClass("uk-icon-check-square");
	target_shell.removeClass("selected-shell");
	
	//creat button
	if( $(".flow-nav").find(".quick-create").length ){
		$("#btnQuickCreateModal").css("display", "block");	
	}else{
		$("#btnQuickCreateModal").css("display", "none");
	}
};

var doRemoveFlowTargetModal = function(event){
	
	var target_id = $(this).siblings("div").attr("value");
	target_id = "#"+target_id;
	$(this).parents("li").remove();
	$(".flow-nav").find(target_id).remove();
	
	var target_shell = $(".shell-ul").find( target_id );
	var target_flow = target_shell.find(".uk-icon-check-square-o");
	target_flow.removeClass("uk-icon-check-square-o");
	target_flow.addClass("uk-icon-check-square");
	target_shell.removeClass("selected-shell");
	
	//creat button
	if( $(".flow-nav").find(".quick-create").length ){
		$("#btnQuickCreateModal").css("display", "block");	
	}else{
		$("#btnQuickCreateModal").css("display", "none");
	}
};

var doQuickCreateModal = function(){
	var quick = [];
	quick = $(this).parent(".flow-nav").find('.quick-create').toArray();
	for (var i=0;i<quick.length;i++){
		//alert ( quick[i].innerHTML ) ;	
	}
	var modal = UIkit.modal("#modal_create");
	modal.show();
};

//################################################################################################################
// ### Profile 
//################################################################################################################


var doProfile = function(target, M_profile_type){
	var user_id = target.attr("value");
	
	$.ajax({
		type: "POST",
	  	url:baseUrl+'intershell/zero/profile/'+ M_profile_type +'/',
	   	data:{"cube_id":cube_id},
	   	//dataType: "JSON",
	   	success:function(data){

	       	target.empty();
	       	target.append(data);
	          
	       	target.removeClass("shell-div");
			target.addClass("shell-list-div");
	    },
	    error:function(){
	        alert('error');
	    }
	});
};

var doProfileUpdateForm = function(event){
	window.location.href = baseUrl + 'intershell/zero/profile/updateR/'+ $(this).attr("value");
};

var doProfileUpdate = function(event){
	var new_nick_name = $("#new_nick_name").val();
	var new_comment = $("#new_comment").val();

	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/profile/update/'+ $(this).attr("value") + '/',
   		data:{"new_comment":new_comment, "new_nick_name":new_nick_name },
   		dataType: "JSON",
   		success:function(data){
   			var Smessage = "sueccess update Profile.";
          	UIkit.notification(Smessage, "success");
        },
        error:function(){
        	var Smessage = "Fail update Profile.";
          	UIkit.notification(Smessage, "danger");
        }
   	});
};



//################################################################################################################
// Search
// 1. search for flow and develope
//################################################################################################################


var doSearch = function(event){
	var M_search_type = "T";
	var search_keyword = $("#search_keyword").val();

	$("#conContent").empty();
	
    if( !search_keyword ){//hash tag click
		search_keyword = $(this).attr("value");
	}


	if ( search_keyword ){
		var promise = $.ajax({
			type: "POST",
		   	url:baseUrl+'intershell/zero/search/',
		   	data:{"search_type":"T", "search_keyword":search_keyword},
		   	success:function(data){
		   		$(".uk-active").removeClass("uk-active");
				$("nav").find('.nav-li-cube').addClass("uk-active");
				
		       	$("#conContent").append(data);
                
                doShellMode("S");
                doExtendMode("H");
                
                search_keyword = "<span class='hashtag uk-margin-right' style='cursor:pointer'>#" + search_keyword + "</span>";
                $(".search-history").append(search_keyword);

                
		    },
		    error:function(){
		    	alert('doSearch error!');
		    }
		});
        //promise.done( function(){alert("salkdfjalkdfjalskdfj");}  );
        //promise.done( doShellMode("S")  );
        //promise.then( doShellMode("S")  );
	}
    
};

var doSearchTag = function(event){
    event.stopPropagation();
    
    if( $(this).hasClass("hashtag") ){
    	$("#search_keyword").attr("value", $(this).html().replace("#", "") );	
    	var target_html =  "<li class='nav-li' id='' value = 'H'  ><span class='shell-tooltip uk-margin-small-left' uk-tooltip='pos:bottom' title='" + $(this).html() +
		"'  value='"+ $(this).html() +	"' >" + $(this).html() + "</span></li>";

    }else if ( $(this).hasClass( "hashtag-search" ) ){
    	$("#search_keyword").attr("value", $(this).parents(".hashtag-li").find(".hashtag-list").html().replace("#", "")    );
    	$("#search_hashtag").attr("value", $(this).attr("value"));

    	var total_hash = $(this).attr("value").split("_");
  
        var target_html =  "<li class='nav-li' id="+ total_hash +" value = 'H'  ><span class='shell-tooltip uk-margin-small-left' uk-tooltip='pos:bottom' title='" + total_hash[3] +
		"'  value='"+ total_hash[3] +	"' >#" + total_hash[3] + "</span></li>";
	
    }

	$(".nav-ul").append(target_html);    
    $.session.set('nav_act_html', $("#nav_ul").html() );

    doSearch();
};

var doSearchMode = function(){
    $(".search-history-div").toggle();  
    $(this).toggleClass("uk-icon-chevron-down uk-icon-chevron-up");
};

// 2. search for user
var doSearchUser = function(){
	var M_search_type = "U";
	var search_keyword = $("#search_keyword").val();
	
	if ( search_keyword.length > 0  )
	{
		$.ajax({
			type: "POST",
		   	url:baseUrl+'intershell/zero/search/',
		   	data:{"search_type":M_search_type, "search_keyword":search_keyword},
		   	//dataType: "JSON",
		   	success:function(data){
		       	$("#conContent").empty();
		       	$("#conContent").append(data);
		       	},
		    error:function(){
		    	alert('doSearchUser error!');
		    }
		});
	}
};



//################################################################################################################
// ### M_Create  Module 
// SHELL CREATE total function 
//################################################################################################################

var doCreateForm = function(event){// all action when create form load
    //display mode change
    
    //alert("doCreateForm");
    
	$("#M_create_type").attr("value", "C");

    
	//loaded create form
	$("#M_create_div").css("display", "block");
    $("#btnCreate").css("display", "none");
    
	//make clear cube and shell
	doClearModule('M_shell');
	doClearModule('M_cube');
	doClearModule('M_Search');
	
	//prepare create-form module to conContent
	var M_create_form = $(".M-create-form-dup").detach();
	M_create_form.removeClass("M-create-form-dup");
	M_create_form.addClass("M-create-form");
    M_create_form.find("#cube_data_dup").append("<span class='cube-title-create cf-article-title cube-NC' id='create_cube_dup' >create cube...</span>");

	$("#mainSearch").empty();
	$("#M_Cube").css("display", "none");
	$("#conContent").append( M_create_form );

	// CUBE display
	$("#create_cube_dup").css("display", "block");
	$("#cube_data_dup").css("display", "block");
    
	
    //SHELL for create duplicate
	var create_target_shell_temp = M_create_form.find(".create-target-shell-li-temp").clone();
	create_target_shell_temp.addClass("create-target-shell-li");
    //create_target_shell_temp.addClass("shell-li");
	create_target_shell_temp.removeClass("create-target-shell-li-temp");
    
	create_target_shell_temp.css("display","block");
	create_target_shell_temp.find(".cf-article-lead").addClass("create-shell-dup");
	$(".M-create-form").find(".M-create-shell-ul").append( create_target_shell_temp );
	
	//edit shell
	//$(".M-create-form").on("click",".create-shell", doActiveCreateShell);  20161108
    //add remove flow target
	//$(".M-create-form").on("click",".flow-shell-select", doAddFlowNav );

	//COMMON ACTION CREATE
	$(".hide-create").css("display", "none");
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );
};

var doCancelCreateForm = function(){
    //modechange cancel create form
    //re do check (clear the create form )


    $("#M_create_div").css("display", "none");
    $("#btnCreate").css("display", "block");
    
    //change visiable not shown create mode
	$(".create-hide").css("display", "block");
	
	$("#M_Cube").css("display", "block");

	//change topcontrol heigt ( because sticky )
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true));
};


var doRemoveCreateFormLi = function(){
    //alert ( "doCreateFormLiRemove" );
	var create_shell_li_count = $('.create-shell').length; // add create-shell-dup count	
	//alert ( create_shell_li_count );
	
	if( create_shell_li_count == 2 ){
		if ( $(this).siblings("span").hasClass("create-shell-dup") ){
			$('.create-shell').first().addClass("create-shell-dup");	
			$("#new_shell").val("");
			$(".highlighter").empty();
		} 
		$(this).siblings("span").empty();
	}
	else{
		$(this).parents("li").remove();	
		
		if ( $(this).siblings("span").hasClass("create-shell-dup") ){
			//$( "ul li:nth-child(2)" ) ref : https://api.jquery.com/nth-child-selector/
			$('.create-shell:eq(1)').first().addClass("create-shell-dup");	
			
			$("#new_shell").val("");
			$(".highlighter").empty();
			
			$(".highlighter").html( $(".create-shell-dup").html() );
			$("#new_shell").val( $(".create-shell-dup").html().replace(/<br\s*\/?>/mg,"\n") );
		} 
	}
};


var doUpdateCubeForm = function(event){
	event.stopPropagation();

	// backup sorce DATA
	var target_article_id = '#article_' +  $(event.currentTarget).attr("value");

	var target_article = $("#conContent").find(target_article_id);

	var update_mode = $("#btnUpdateForm");

	$(".cube-not-selected").css("display","none");
	$(".cube-selected").css("display","block");

	if ( update_mode.hasClass("cube-on-update") ){
		$("#TC_cube_mode").removeClass("cube-on-update");

		update_mode.removeClass("cube-on-update");
		update_mode.html("Update Cube");

		$("#btnAddNewShell").attr("disabled","");
		$("#btnUpdate").attr("disabled","");
		
		target_article.removeClass("cube-on-update");
		target_article.find(".shell-on-update").css("display", "none");
		target_article.find(".shell-action").css("display", "block");

		target_article.find(".cube-on-update").css("display", "none");
		target_article.find(".cube-on-update").css("visibility", "hidden");
		//target_article.find(".cube-action").css("display", "block");

		target_article.find(".shell-content-shell").removeClass("uk-card uk-card-default uk-card-hover uk-card-body");
		target_article.find(".create-target-shell-li").remove();
		target_article.find(".flow-target-shell-li").remove();

	}
	else{
		$("#TC_cube_mode").addClass("cube-on-update");

		update_mode.html("Cancel Update Cube");
		update_mode.addClass("cube-on-update");

		//$(this).remove
		$("#btnAddNewShell").removeAttr("disabled");
		$("#btnUpdate").removeAttr("disabled"); 
		

		target_article.find(".shell-li").each(function(){
            if($(this).hasClass("shell-hidden")){
               $(this).css("display", "block");         
            }
        });
        target_article.find(".cube-show-all").html("close shell");

		target_article.addClass("cube-on-update");
		target_article.find(".shell-on-update").css("display", "block");
		target_article.find(".shell-action").css("display", "none");

		target_article.find(".cube-on-update").css("display", "block");
		target_article.find(".cube-on-update").css("visibility", "visible");
		//target_article.find(".cube-action").css("display", "none");

		target_article.find(".shell-content-shell").addClass("uk-card uk-card-default uk-card-hover uk-card-body");
		UIkit.sortable( target_article.find('.shell-ul') , {group: 'update-cube' });	
	}
	
};

var doAddNewShell = function(event){
	event.stopPropagation();

	//on the update Mode
	var target_article = '#article_' + $(event.currentTarget).attr("value");
	target_article = $("#conContent").find(target_article);

	var NewShell = target_article.find(".shell-content-div").first().clone();
	
	NewShell.find(".shell-add-div").remove();
	NewShell.find("textarea").remove();
	NewShell.find(".shell").after( '<textarea class="uk-textarea shell-update" rows="5"  placeholder="" ></textarea>').css("display", "none");

	NewShell.appendTo( target_article.find(".shell-ul") ).wrap("<li class='create-target-shell-li' value='0_0_0'></li>");
};

var doAddNewShell_old_20170220 = function(event){
	event.stopPropagation();

	//on the update Mode
	var NewShell = $(".M-Create").find(".shell-content-div-dup").clone();
	NewShell.removeClass("shell-content-div-dup");
	NewShell.addClass("shell-content-div");

	var target_article = '#article_' + $(this).attr("value");
	target_article = $("#conContent").find(target_article);

	target_article.find(".shell-edit").css("display", "none");
	target_article.find(".shell-on-update").css("display", "block");

	NewShell.appendTo( target_article.find(".shell-ul") ).wrap("<li class='create-target-shell-li' value='0_0_0'></li>").find(".M-create-shell-div").addClass("uk-card uk-card-default uk-card-hover uk-card-body");
};


var doAddShell = function(event){ // create form with add shell 
	event.stopPropagation();
	//change to update form
	if(  $(event.currentTaret).hasClass("cube-on-update") ){
		

	}else if ( $("#TC_cube_mode").hasClass("cube-on-update") ){
		return false;
	}else {
		$(event.currentTaret).addClass("cube-on-update");
		doClickCube(event);
		doUpdateCubeForm(event);
		doAddNewShell(event);
	}
	
	
};


var doAddShell_old_20170222 = function(event){ // create form with add shell 
	event.stopPropagation();

	//create form을 호출하는 방식 
	// update form을 호출 및 shell 추가 액션으로 변경 

 	//alert("doAddShell");
	$("#M_create_type").attr("value", "C");

	//loaded create form
	$("#M_create_div").css("display", "block");
    $("#btnCreate").css("display", "none");

 	$(this).parents(".sticky-cube").removeClass("uk-active");
 	$(this).parents(".sticky-cube").removeAttr("style");
	var target_cube_html = $(this).parents(".sticky-cube").clone().wrapAll("<div/>").parent().html();

 	//var target_shell_li_html = $(this).parents(".cube-li").find(".shell-ul").html();

	//duplicate and add conContent the M-create-form
	var M_create_form = $(".M-create-form-dup").detach();
	M_create_form.removeClass("M-create-form-dup");
	M_create_form.addClass("M-create-form");
    
    
	$("#mainSearch").empty();
	$("#M_Cube").css("display","none");
	$("#conContent").append( M_create_form );

	M_create_form.find(".M-create-cube").append( target_cube_html );
    M_create_form.find(".M-create-cube").find(".cf-article-title").addClass("cube-MC");
	//M_create_form.find(".M-create-shell-ul").append( target_shell_li_html );
    
    doChangeAddShellMode( $(this).parents(".cube-li"));
    doMoreShell();

    
    $(".M-Create").find('.cube-create-div').css("display","none");
	M_create_form.find(".hide-addshell").css("display","none");

	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );

};

var doChangeAddShellMode  = function(target_cube){
    //change shell to create mode?
	
	var exist_shell_id_list = [];
	exist_shell_id_list = target_cube.find(".shell-li")
			.map(function(){
				return $(this).attr("value");
				})
			.get();
	
	var exist_shell_list;		
	exist_shell_list = target_cube.find(".shell-content")
			.map(function(){
				return $(this).text();
				})
			.get();
    
    
	for (var i=0;i < exist_shell_id_list.length;i++){
		var exist_target_shell = $(".create-target-shell-li-temp").clone();
        
		exist_target_shell.removeClass("create-target-shell-li-temp");
        exist_target_shell.find(".cf-article-lead").removeClass("create-shell");
        exist_target_shell.css("display","block");

        exist_target_shell.addClass("exist-target-shell-li");    
        exist_target_shell.attr("value", exist_shell_id_list[i] );
        exist_target_shell.find(".cf-article-lead").html( exist_shell_list[i] );

        exist_target_shell.find(".uk-panel").removeClass("cf-panel-box-secondary-selected");
        exist_target_shell.find(".uk-panel").addClass("cf-panel-box-secondary");

        exist_target_shell.find(".uk-close").on("click", doRemoveFlowLi );

        exist_target_shell.find(".new-shell").prepend('<i class="uk-icon-circle   uk-margin-small-right"></i>');

        $(".M-create-form").find(".M-create-shell-ul").append( exist_target_shell );
	}
	
};



var doChangeCreateMode = function(type){
	$("#M_create_type").attr("value", type);
	
	if( type == "A"){//addshell
		$(".cube-create-div").css("display", "none");
		//alert ( $("#M_create_type").attr("value") ) ;
	}else if (type =="C"){
		
	}
};

var doTargetRadio = function(){
	console.log('target radio selected');
};

var doCubeCheck = function(event){
	var target_cube_li = $(this).parents(".cube-li")
	$(".M-create-cube").css("display", "block");
	$(".M-create-cube").empty();

    var target_cube_html = $(this).parents(".sticky-cube").clone().wrapAll("<div/>").parent().html();
    
    $(".M-create-cube").append( target_cube_html );
	doRetrieveShellList( target_cube_li.find(".shell-div") ,'F');

	$(".M-create-cube").find(".radio-cube-check").css("display", "none");
    $(".M-create-cube").find(".cube-title").addClass("cube-MC");
    
    //alert ($( "input:checked" ).val());
	//$(".hide-addshell").css("display","none");
};

var doKeyupNewShell = function(event){
    //$('.M-create-form').find('.create-shell-dup').html( $('.highlighter').html() );
    $('.M-create-form').find('.create-shell-dup').html( $('#new_shell').val() );
    //position of conContent(create cube panel)
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true));
};

var doKeydownNewShell = function(event){
    // limit col and row test 
    
    var shell_char = $(this).val();
    var shell_text_length = shell_char.replace(/(\r\n|\n|\r)/gm,"").length;  
    
    if ( parseInt(shell_text_length) != 0 && parseInt(shell_text_length % 90 ) == 0) {
        $(this).val(shell_char + '\n');
    }else if( parseInt(shell_text_length) >= 810 )  {
    	UIkit.modal.alert('Only 810 char is allowed!');
	 	return false;
    }

    if(event.keyCode == 13 && $(this).val().split("\n").length >= $(this).attr('rows')) { 
	  	UIkit.modal.alert('Only 9 rows allowed!');
	 	return false;
	}
        
    
};

var doCheckByte = function(val){  
    var maxlength = 10;  
    var len=val.value.length;  
    var temp=val.value;  
    var bytes=0;  

    for(var k=0;k<len;k++){  
        var onechar=temp.charAt(k);  
        if(escape(onechar).length>4){  
            bytes += 2;  
        }else if(onechar!='\r'){  
            bytes+=1;  
        }  
    } 
    return bytes;  
};

var doActiveCreateShell = function(event){
	event.stopPropagation();
	//.new-shell is this
    //alert("doActiveCreateShell");
    
	var target_shell = $(this).find(".create-shell"); 
    
    $(".M-create-form-shell-div").find(".cf-panel-box-secondary-selected").addClass("cf-panel-box-secondary");
    $(".M-create-form-shell-div").find(".cf-panel-box-secondary").removeClass("cf-panel-box-secondary-selected");
    
    $(this).addClass("cf-panel-box-secondary-selected");
    $(this).removeClass("cf-panel-box-secondary");
    
    $(".create-shell-dup").removeClass("create-shell-dup");
    $(this).find(".create-shell").addClass("create-shell-dup");
    
    $("#new_shell").val("");
    $(".highlighter").empty();
	$(".highlighter").html(target_shell.html() );
	$("#new_shell").val(target_shell.html().replace(/<br\s*\/?>/mg,"\n") );
    
};


var doMoreShell = function(event){
	$("#new_shell").val("");
	$(".highlighter").empty();

	$(".M-create-form-shell-div").find(".uk-panel").removeClass("cf-panel-box-secondary-selected");
	$(".M-create-form-shell-div").find(".uk-panel").addClass("cf-panel-box-secondary");
	$(".M-create-form").find(".cf-article-lead").removeClass("create-shell-dup");

	var create_target_shell_temp = $(".M-create-form").find(".create-target-shell-li-temp").clone();
	create_target_shell_temp.addClass("create-target-shell-li");
    //create_target_shell_temp.addClass("shell-li");
	create_target_shell_temp.removeClass("create-target-shell-li-temp");
	create_target_shell_temp.css("display","block");
	create_target_shell_temp.find(".cf-article-lead").addClass("create-shell-dup");
    create_target_shell_temp.find(".uk-panel").removeClass("cf-panel-box-secondary");
	create_target_shell_temp.find(".uk-panel").addClass("cf-panel-box-secondary-selected");
	
	$(".M-create-form").find(".M-create-shell-ul").append(create_target_shell_temp);
    $(".M-create-form").on("click",".new-shell", doActiveCreateShell ); //more shell li active
};


var doRemoveFlowLi = function(event){
    //alert ("doRemoveFlowLi");
    $(this).parents(".flow-target-shell-li").remove();
};


//shell create option 
var doCubeSelect = function(event) {
	//add crete form cube and shell
	// modal-MC click event 

	var target_cube_html = $(this).parents(".mc-cube-div").clone().wrapAll("<div/>").parent().html();
	$(".M-create-mc-cube-div").empty();
	$(".M-create-mc-cube-div").addClass("cf-panel-box-secondary-selected");
	$(".M-create-mc-cube-div").append( target_cube_html );
	$("#new_cube").css("display","none");

	$("#modal_MC").find (".cf-panel-box-secondary-selected").removeClass("cf-panel-box-secondary-selected");
	$("#modal_MC").find (".mc-cube-select").removeClass("mc-cube-select");
	$(this).parents(".mc-cube-li").addClass("cf-panel-box-secondary-selected");
	$(this).parents(".mc-cube-li").addClass("mc-cube-select");

	//Create form 
	$(".M-create-form").find(".M-create-cube").append(target_cube_html);
	$(".M-create-form").find(".M-create-new-cube").css("display","none");
	$(".M-create-form").find(".mc-cube-div").addClass("cube-MC");

	doChangeAddShellMode( $(this).parents(".mc-cube-li"));
	$(".hide-create").css("display", "block");
	$(".hide-addshell").css("display", "none");

};

var doShellSelect = function(){
	var selected = $("#new_shell_select option:selected").val();
    
	if (selected == 'NS') {
		$(".new-shell-div").toggle();
    }
    else if (selected == 'AC') {
        $(".new-shell-div").toggle();
        //alert ($("#M_cube").length );
        
        // target shell remove 
    }
};


var doCubeEdit = function(event){
	alert("cube edit");

};

var doShellEdit = function(event){
	var target_shell_li = $(this).parents(".shell-li");
	target_shell_li.addClass("develop-target-shell-li");
	target_shell_li.find(".shell-edit").css("display", "block");
	target_shell_li.find(".shell-on-update").css("display", "none");


	var EditShell = target_shell_li.find(".shell");
	EditShell.css("display", "none");
	var tmp_text = EditShell.html().replace(/<br\s*\/?>/mg,"\n");

	target_shell_li.find(".shell").after( '<textarea class="uk-textarea shell-update" rows="5"  placeholder="" ></textarea>');

	var tmp = document.createElement("DIV");
    tmp.innerHTML = tmp_text;
    tmp_text = tmp.textContent || tmp.innerText;
	target_shell_li.find(".uk-textarea").html(tmp_text);

};

var doShellEditCancel = function(event){
	//alert("doShellEditCancel");
	var target_shell_li = $(this).parents(".shell-li");
	target_shell_li.removeClass("create-target-shell-li");
	target_shell_li.find(".shell-edit").css("display", "none");
	target_shell_li.find(".shell-on-update").css("display", "block");
		
	target_shell_li.find(".shell").css("display", "block");
	target_shell_li.find(".shell-update").remove();
};

var doShellEditDone = function(event){
	var target_shell_li = $(this).parents(".shell-li");
	var tmp_text = target_shell_li.find(".shell-update").html().replace(/<br\s*\/?>/mg,"\n");

};

var doShellRemove = function(event){
	var target = $(this);
	if( !target.hasClass("add-shell") ){
		UIkit.modal.confirm('Do you really want to remove This Shell? <br> Shell is not Delete and just your connection will remove.').then(function() {
			target.parents(".shell-li").css("display","none");
			target.parents(".shell-li").addClass("delete-target-shell-li");
		}, function () {

		});
	}
	
};

var doTotalUpdate = function(event){ // update in cube mode
	var dataSet = {"dataset":"Total_update"};

	var target_cube_id = $(this).attr("value");
	var target_article = "#article_" + target_cube_id;
	var target_cube_li = $(target_article).parents(".cube-li");
	var target_cube = $(target_article);

	var shell_con_list = []; 
    var item;

    var con_shell_list;
	var con_shell_list_JSON = [];

	var shell_index=0;
	var con_index=0;	
	
	$.extend(dataSet, {"cube_id":target_cube_id } );
	$.extend(dataSet, {"cube": target_cube.find("cube").html()  } );
	
	target_cube.find(".shell-ul").find('li').each(function(){// SHELL LIST 
        con_shell_list = $(this).attr("value").split("_"); 
		
		item = {};
		
		if( $(this).hasClass('flow-target-shell-li') ){//type FLOW LI
			item["create_type"] = "F" ;
			item["source_con_id"] = con_shell_list[1];
			item["shell_id"] = con_shell_list[2] ;
			item["con_seq"] = ''+ con_index;
			con_index++;
			con_shell_list_JSON.push(item);
            
		}else if( $(this).hasClass('develop-target-shell-li') ){// CREATE LI
			item["create_type"] = "D" ;

			// reove target con_id  con_type : H
			item["history_con_id"] = con_shell_list[1];
			
			var tmp_text = $(this).find(".shell-update").val().replace(/<br\s*\/?>/mg,"\n");
            //http://stackoverflow.com/questions/33722415/how-to-remove-html-tags-using-javascript-and-keep-newline
            //strip html 
            var tmp = document.createElement("DIV");
            tmp.innerHTML = tmp_text;
            tmp_text = tmp.textContent || tmp.innerText;
            item["shell"] = tmp_text;
            
			item["shell_seq"] = ''+shell_index;
			item["con_seq"] = ''+con_index;
			shell_index++;
			con_index++;

			con_shell_list_JSON.push(item);
            
		}else if( $(this).hasClass('create-target-shell-li') ){// CREATE LI
			item["create_type"] = "C" ;

			// no update exist
			item["shell_id"] = 0;
			item["con_id"] = 0; 
			
			var tmp_text = $(this).find(".shell-update").val().replace(/<br\s*\/?>/mg,"\n");
            //http://stackoverflow.com/questions/33722415/how-to-remove-html-tags-using-javascript-and-keep-newline
            //strip html 
            var tmp = document.createElement("DIV");
            tmp.innerHTML = tmp_text;
            tmp_text = tmp.textContent || tmp.innerText;
            item["shell"] = tmp_text;
            
			item["shell_seq"] = ''+shell_index;
			item["con_seq"] = ''+con_index;
			shell_index++;
			con_index++;

			con_shell_list_JSON.push(item);
            
		}else if ( $(this).hasClass('delete-target-shell-li') ){// temp LI
			//nothing will be remove
			// what should do?
		}else{// EXIST CUBE change LI
            //exist-target-shell-li
			item["create_type"] = "E" ;
			item["con_id"] = con_shell_list[1];
			item["shell_id"] = con_shell_list[2] ;
			con_shell_list_JSON.push(item);
		}
	}); 
	
	$.extend(dataSet, {"con_shell_list" : con_shell_list_JSON }) ;

	//alert ( JSON.stringify( con_shell_list_JSON ) ) ;
	alert ( JSON.stringify( dataSet ) );

	
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/createCRUD/',
   		data:JSON.stringify( dataSet ) ,
   		dataType: "JSON",
   		success:function(data){

   			//alert(data.cube_id);

   			doRetrieveCubeOneH(data.cube_id, 'update', target_cube_li);

   			//doRetrieveShellList(target_cube_li.find( ".shell-div" ), 'F');

   			var Smessage = "sueccess update Cube.";
          	UIkit.notification(Smessage, "success");
        },
        error:function(){
            alert('doTotalCreate - Update failed - ajax error');
        }
   	});
   	
   	
};

var doTotalCreate = function(event){ // create new shell
	
    var dataSet = {"dataset":"Total_create"};
    var M_create_type = $("#M_create_type").attr("value");
    
    var shell_con_list = []; 
    var item;
	
	var hashtags;
	var hash;
	
	var con_shell_list;
	var con_shell_list_JSON = [];
	
	var shell_index=0;
	var con_index=0;

    
	if ( $(".M-create-form").find(".cube-MC").length == 1 ) {
		$.extend(dataSet, {"cube_id": $(".M-create-form").find(".cube-MC").attr("value") } );
	}else if($("#new_cube").val() != '' ){
		$.extend(dataSet, {"cube": $("#new_cube").val() } );	
	}else {
		UIkit.modal.alert('No Cube!');
		return false;
	}

	if ( $(".M-create-form-shell-div").find('li').length == 1){
		UIkit.modal.alert('No Shell!');
		return false;
	} else {

	 	$(".M-create-form-shell-div").find(".create-shell").each(function(){
	 		if( $(this).val() == 0 ){
	 			//UIkit.modal.alert('empty Shell!');	
	 			//return false;
	 		}
	 	});
	} 


	$(".M-create-form-shell-div").find('li').each(function(){// SHELL LIST 
		//li만 찾을경우 다른 li가 있으면 정상적으로 찾지 못함. 
		
        con_shell_list = $(this).attr("value").split("_"); 
		
		item = {};
	    item ["shell_id "] = con_shell_list[2] ;
		//hashtags = [];
		
		if( $(this).hasClass('flow-target-shell-li') ){//type FLOW LI
			item["create_type"] = "F" ;
			item["source_con_id"] = con_shell_list[1];
			item["con_seq"] = ''+ con_index;
			con_index++;
			con_shell_list_JSON.push(item);
            
		}else if( $(this).hasClass('create-target-shell-li') ){// CREATE LI
			item["create_type"] = "C" ;
			item["con_id"] = con_shell_list[1];
			var tmp_text = $(this).find(".create-shell").html().replace(/<br\s*\/?>/mg,"\n");
            
            //http://stackoverflow.com/questions/33722415/how-to-remove-html-tags-using-javascript-and-keep-newline
            //strip html 
            
            var tmp = document.createElement("DIV");
            tmp.innerHTML = tmp_text;
            tmp_text = tmp.textContent || tmp.innerText;
            item["shell"] = tmp_text;
            
			item["shell_seq"] = ''+shell_index;
			item["con_seq"] = ''+con_index;
			shell_index++;
			con_index++;
			con_shell_list_JSON.push(item);
            
		}else if ( $(this).hasClass('create-target-shell-li-temp') ){// temp LI
			//nothing
		}else{// EXIST CUBE change LI
            //exist-target-shell-li
			item["create_type"] = "E" ;
			item["con_id"] = con_shell_list[1];
			con_shell_list_JSON.push(item);
		}
	}); 
	
	$.extend(dataSet, {"con_shell_list" : con_shell_list_JSON }) ;

	//alert ( JSON.stringify( con_shell_list_JSON ) ) ;
	//alert ( JSON.stringify( dataSet ) ) ;

	
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/createCRUD/',
   		data:JSON.stringify( dataSet ) ,
   		dataType: "JSON",
   		success:function(data){

           	$("#new_cube").val("");
           	$("#new_shell").val("");
           	//loaded create form
			$("#M_create_div").css("display", "none");
			$("#btnCreate").css("display", "block");

			var M_create_form_temp = $("#conContent").html();

			$("#conContent").empty();

			$(".create-target-dup-group").append( M_create_form_temp );
			$(".M-create-form").addClass("M-create-form-dup");
			$(".M-create-form").removeClass("M-create-form");
			$(".M-create-form-dup").find(".create-target-shell-li").remove();

           	doRetrieveCubeOneH(data.cube_id, 'create' ,$("#conContent") );
            
           	doStaticReload('M_cube');
	      	doStaticReload('M_shell');

           	$("#conContent").css("display","block");
           	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true));
        },
        error:function(){
            alert('doTotalCreate - view CRUD failed - ajax error');
        }
   	});
   	
   	
};
