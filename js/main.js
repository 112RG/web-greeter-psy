var children;
var curr = 1;
var selected_user = null;
var password = null;
var $user = $("#name");
var $pass = $("#passwordInput");
var sessions = null;
function show_error()
{
	console.log("error")
}
function show_message(msg)
{
	document.getElementById("login-response").innerHTML = msg;
}

function setup_users_list()
{
	var $list = $user;
    var to_append = null;
    $.each(lightdm.users, function (i) {
        var username = lightdm.users[i].name;
        var dispname = lightdm.users[i].display_name;
        $list.append(
            '<div id="'+username+'">'+dispname+'</div>'
        );
    });
    children = $("#name").children().length;
}

function select_user_from_list(idx, err)
{
	var idx = idx || 0;

    if(lightdm.authentication_user){
        lightdm.cancel_authentication();
    }

    selected_user = lightdm.users[idx].username;
    if(selected_user !== null) {
        start_authentication(selected_user);
    }

    $pass.trigger('focus');
}

function start_authentication(username)
{
   lightdm.cancel_autologin();
   label = document.getElementById('countdown_label');
   if (label != null)
       label.style.visibility = "false";
	
	selected_user = username;
    lightdm.authenticate(username);
    
    show_message("?");
}

function authentication_complete()
{
    if (lightdm.is_authenticated) {
        setTimeout(lightdm.start_session(sessions[2].name), 2000);
        
    } else
   	{
    	select_user_from_list(curr-1, true);
    	show_message ("Wrong Password!");
   	}

}


function provide_secret()
{
  	password = $pass.val() || null;
  	if(password !== null)
        lightdm.respond(password);
}

function init()
{
    sessions = lightdm.sessions;
    lightdm.authentication_complete.connect(authentication_complete);
    setup_users_list();
    select_user_from_list(0, false);
    show_message ("&nbsp");
    $("#last").on('click', function(e) {
    	curr--;
		if(curr <= 0)
			curr = children;
		if(children != 1) select_user_from_list(curr-1, false);
		$("#name").css("margin-left", -31-(265*(curr-1))+"px");
		show_message("&nbsp");
    });

    $("#next").on('click', function (e) {
    	curr++;
		if(curr > children)
			curr = 1;
		if(children != 1) select_user_from_list(curr-1, false);
		$("#name").css("margin-left", -31-(265*(curr-1))+"px");
		show_message("&nbsp");
    });
}

init();
