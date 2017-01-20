//#######################################################################
//# This file is part of Webrsnapshot - The web interface for rsnapshot
//# Copyright© (2013-2014) Georgi Dobrev (dobrev.g at gmail dot com)
//#
//# Webrsnapshot is free software: you can redistribute it and/or modify
//# it under the terms of the GNU General Public License as published by
//# the Free Software Foundation, either version 3 of the License, or
//# (at your option) any later version.
//#
//# Webrsnapshot is distributed in the hope that it will be useful,
//# but WITHOUT ANY WARRANTY; without even the implied warranty of
//# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//# GNU General Public License for more details.
//#
//# You should have received a copy of the GNU General Public License
//# along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
//#######################################################################

// JS to get tabs working 
$(function() { $( "#tabs" ).tabs(); });

// JS to get menu working
$(function() { $( "#menu" ).menu(); }); 

// JS to get accordion(Hosts) working
$(function() { 
  $( "#accordion" ).accordion({
    collapsible: true,
      heightStyle: "content",
  });
});

// JS to get Tooltips working
$(function () { 
  $(document).tooltip({ 
    track: true,
    tooltipClass:'tooltip', 
    content: function () { 
      return $(this).prop('title'); 
    } 
  }); 
});

// Delete field from include
function delExIn(id) {
  $("#"+id+"_info").remove();
  $("#"+id+"_label").remove();
  $("#"+id).remove();
}


//Add field to include Config
function addInclude(buttonid, count) {
  var next = parseInt(count)+1;
  document.getElementById(buttonid).name         = next;
  document.getElementById("include_count").value = next;
  $("#include").append('<div class="infoicon" id="include_' + count +'_info">' +
      '<img src="default/img/info.png" ' + 
        'title="This gets passed directly to rsync using the <b>--include</b> directive.' +
          'This parameter can be specified as many times as needed, with one pattern defined' +
          'per line." />'+
    '</div>'+
    '<div class="configlabel" id="include_' + count + '_label"><LABEL>include</LABEL></div>' +
    '<div id="include_' + count + '">' +
      '<INPUT type="button" value="删除" onclick="delExIn(\'include_' + count +'\');"> ' + 
      '<INPUT type="text" class="configfield" name="include_' + count + '" value="" />' +
    '</div>');
}

// Add field to exclude Config
function addExclude(buttonid, count) {
  var next = parseInt(count)+1;
  document.getElementById(buttonid).name         = next;
  document.getElementById("exclude_count").value = next;
    $("#exclude").append('<div class="infoicon" id="exclude_'+ count +'_info">' +
        '<img src="default/img/info.png" '+
          'title="This gets passed directly to rsync using the <b>--exclude</b> directive.' + 
          'This parameter can be specified as many times as needed, with one pattern defined' + 
          'per line." />' +
      '</div>' +	
      '<div class="configlabel" id="exclude_' + count + '_label"><LABEL>exclude</LABEL></div>' +
      '<div id="exclude_'+ count + '">' +
        '<INPUT type="button" value="删除" onclick="delExIn(\'exclude_' + count + '\');"/> ' +
        '<INPUT type="text" class="configfield" name="exclude_' + count +'" value="" />' +
      '</div>');
}

// Delete Host Config
function serverDelete(id) {
  $( "#server_"+id+"_name" ).remove();
  $( "#server_"+id+"_config" ).remove();
}

// And Delete specific directory from backuped host
function srvDelDir(serverid, dirid) {
  $( "#server_"+serverid+"_dir_"+dirid        ).remove();
}

//Add another directory for backup on specific host
function srvAddDir(buttonid, dir_id, serverid) {
  // alert("Servername: " + name + "\nServerid: " + serverid);
  var next = parseInt(dir_id)+1;
  document.getElementById(buttonid).name = next;
  document.getElementById("server_" + serverid + "_dircount").value = next;
  $("#server_" + serverid + "_dirs").append('<div id="server_' + serverid + '_dir_' + dir_id + '">' +
      '<INPUT type="button" value="删除" id="server_' + serverid + '_dir_' + dir_id + '_del" ' +
              'onclick="srvDelDir(' + serverid + ', ' + dir_id + ')" /> ' + 
      '<INPUT type="text" id="server_' + serverid + '_dir_' + dir_id + '_dir" class="configfield"' +
              'name="server_' + serverid + '_dir_' + dir_id + '_dir" value="" /> ' +
      '<INPUT type="text" id="server_' + serverid + '_dir_' + dir_id + '_args" class="configfield"' +
              'name="server_' + serverid + '_dir_' + dir_id + '_dir" value="" /><br/></div>');
}

//Add new Host
$(function() {
  var newservername = $( "#newservername" ),
      newserverip   = $( "#fqdn" );
      newserverid   = $( "#servers_count" ).val();

  function checkInput( inputValue ) {
    if ( inputValue ) {
      return true;
    } else {
      return false;
    }
  }

  $( "#add-server-form" ).dialog({
    autoOpen: false,
    height: 320,
    width: 400,
    modal: true,
    buttons: 
    {
      "追加主机": function()
      {
        var inputValid = true;
        inputValid     = inputValid && checkInput( newservername.val() );
        inputValid     = inputValid && checkInput( newserverip.val() );

        var serverdir  = "root@" + newserverip.val() + ":";
        var newserverstring = '<div id="server_' + newserverid + '_config">' +
        '<INPUT type="hidden" id="server_label_' + newserverid + '"' +
        'name="server_label_' + newserverid + '" value="' + newservername.val() + '"/>' +
      '<div id="server_' + newserverid + '_dirs">' +
        '<div id="server_' + newserverid + '_dir_0">' +
          '<INPUT type="hidden" id="server_' + newserverid + '_dir_0_dir"' +
            'name="server_' + newserverid + '_dir_0_dir"' +
            'class="configfield" value="' + serverdir + '/etc/" />' +
          '<INPUT type="hidden" id="server_' + newserverid + '_dir_0_args"' +
            'name="server_' + newserverid + '_dir_0_args"' +
            'class="configfield" value="" />' +
          '<br/>' +
        '</div>' +
    '</div>' +
    '<INPUT type="hidden" id="server_' + newserverid + '_dircount"' +
        'name="server_' + newserverid + '_dircount" value="1" />' +
  '</div>';

        if ( inputValid )
        {
          $("#accordion").append(newserverstring);
          // VERY IMPORTANT. Increate the Host count so the new server can be parsed
          document.getElementById('servers_count').value = parseInt(newserverid) + 1;
          document.rsnapshotconfform.submit();
        }
      },
      取消: function() { 
        $( this ).dialog( "close" );
      }
    },
    关闭: function() 
    {
      allFields.val( "" ).removeClass( "ui-state-error" );
    }
  });
  
  $( "#serverAdd" ).button().click(function() 
  {
    $( "#add-server-form" ).dialog( "open" );
  });
});



//Delete line from backup_script 
function delBkpScript(id) {
	$("#bkp_script_"+id+"_info").remove();
	$("#bkp_script_"+id+"_label").remove();
	$("#bkp_script_"+id).remove();
}

//Add line to backup_script 
function addBkpScript(buttonid,count) {
  var next = parseInt(count)+1;
  document.getElementById(buttonid).name            = next;
  document.getElementById("bkp_script_count").value = next;
  $("#bkp_scripts").append('<div class="infoicon" id="bkp_script_' + count + '_info">' +
      '<img src="default/img/info.png"' +
        'title="This script should simply create files and/or directories in its current working directory.' +
        '<b>rsnapshot</b> will then take that output and move it into the directory specified in the third' +
        'column.<br/>' +
        'Please note that whatever is in the destination directory will be completely deleted and recreated.' +
        'For this reason, rsnapshot prevents you from specifying a destination directory for a ' +
        '<b>backup_script</b> that will clobber other backups." />' +
    '</div>' +
    '<div class="configlabel" id="bkp_script_' + count + '_label"><LABEL>backup_script</LABEL></div>' +
    '<div id="bkp_script_' + count + '">' +
      '<INPUT type="button" value="删除" onclick="delBkpScript(' + count + ');"> ' +
      '<INPUT type="text" class="configfieldsmall" value="" name="bkp_script_' + count + '_script"/> ' +
      '<INPUT type="text" class="configfieldsmall" value="" name="bkp_script_' + count + '_target"/> ' +
    '</div>');
}

// Delete line from retain
function delRetain(id) {
	$("#retainNumber_"+id).remove();
}

// Add line to retain
function addRetain(buttonid, current_number) {
  var next = parseInt(current_number)+1;
  document.getElementById(buttonid).name        = next;
  document.getElementById("retain_count").value = next;
  $("#retains").append('<div id="retainNumber_' + current_number + '">' +
      '<div class="infoicon">' +
        '<img src="default/img/info.png" title="The number of snapshots that will be retained for new backups." />' +
      '</div>' +
      '<div class="configlabel">保留 ' +
        '<INPUT type="text" name="retain_' + current_number + '_name" class="configfieldtiny" value="" />' +
      '</div>' +
      '<div>' +
        '<INPUT type="text" name="retain_' + current_number + '_count" class="configfieldtiny" value="" /> ' +
        '<INPUT type="button" value="删除" onclick="delRetain(' + current_number + ');"></div><br/></div>');
}

// Add Crontab
$(function() {
  var newcronid = $( "#newcronid" ).val();

  $( "#add-cronjob-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 640,
    modal: true,
    buttons:
    {
      "添加计划任务": function(){
        var cron  = document.getElementById('cron_minute_text').value;
            cron += " " + document.getElementById('cron_hour_text').value;
            cron += " " + document.getElementById('cron_day_text').value;
            cron += " " + document.getElementById('cron_month_text').value;
            cron += " " + document.getElementById('cron_week_text').value;
            cron += " " + document.getElementById('cron_user').value;
            cron += " " + document.getElementById('cron_command_text').value;
        var newcronstring = '<div id="cron_' + newcronid + '">' +
	    '<INPUT type="text" name="cronjob_' + newcronid + '" id="cronjob_' + 
            newcronid + '" class="configfieldbig"' + 'value="' + cron + '" readonly />' +
	    ' <INPUT type="button" id="cron_edit_' + newcronid + '" value="Edit" />' +
	    ' <INPUT type="button" value="删除" onclick="deleteCronjob(' + newcronid + ')" />' +
	    ' <INPUT type="checkbox" id="cronCheck_' + newcronid + 
            '"  onclick="disbaleCronjob(this.id,' + newcronid + ')" />Disabled<br/></div>';
        $("#cronjobs").append(newcronstring);
	// VERY IMPORTANT. Increate the count so the new cronjob can be parsed
        document.getElementById('newcronid').value = parseInt(newcronid) + 1;
        document.cronform.submit();
      },
      取消: function() {
        $( this ).dialog( "close" );
      }

    },
    关闭: function()
    {
      allFields.val( "" ).removeClass( "ui-state-error" );
    }
  });

  $( "#add_cron" ).button().click(function()
  {
    $( "#add-cronjob-form" ).dialog( "open" );
  });
});

// Add Crontab, select funktionality
function changeCronSelect(id)
{
  document.getElementById(id+'_text').value = document.getElementById(id).value;
}


// Delete Crontab
function deleteCronjob(id)
{
  $("#cron_"+id).remove();
}

// Enable/Disable Crontab
function disbaleCronjob(btnid,id)
{
  var cronvalue = document.getElementById('cronjob_'+id).value;
  if (document.getElementById(btnid).checked)
  {
    document.getElementById('cronjob_'+id).value = "#"+cronvalue;
  }else{
    document.getElementById('cronjob_'+id).value = cronvalue.slice(1);
  }
}

// Enable/Disable Crontab email
function disableCronEmail(btnid) 
{
  if (document.getElementById(btnid).checked)
  {
    document.getElementById('cron_email').readOnly = true;
  }else{
    document.getElementById('cron_email').readOnly = false;
  }  
}

