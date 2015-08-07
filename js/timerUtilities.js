/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function inicializarTimer(sym, nombreTimer) {
    var timerObj = sym.$(nombreTimer);
    $.getJSON("config.json", function (data) {
        $.each(data, function (key, val) {
            timerObj.prop(key, val);
        });
    }).done(function () {
        var spanElement = timerObj.find("p span");
        spanElement.html(secondsToClockFormat(timerObj.prop("segundos")));
        timerObj.prop("segundos_restantes", timerObj.prop("segundos"));
        timerObj.prop("timer_text", spanElement);
        timerObj.prop("interval_id", -1);
        timerObj.prop("nombre", nombreTimer);
    });
}

//*************************************************************************************

function startTimer(timerObj, sym) {
    if (timerObj.prop("interval_id")<0)
    {
        var interval_id = setInterval(function () {
            var currentTime = timerObj.prop("segundos_restantes");
            currentTime--;
            timerObj.prop("timer_text").html(secondsToClockFormat(currentTime));
            timerObj.prop("segundos_restantes", currentTime);
            
            if($.inArray(currentTime, timerObj.prop("alertas"))>=0){
                $("body").trigger({
			type: "TimeAlert",
                        remaining_time: currentTime, 
                        timer_obj: timerObj,
                        sym: sym
		});
            }
            
            if (currentTime <= 0) {
                stopTimer(timerObj);
                $("body").trigger({
			type: "TimeOut",
                        sym: sym
		});
            }
            
        }, 1000);
        timerObj.prop("interval_id", interval_id);
    }
}

//*************************************************************************************

function stopTimer(timerObj) {
    if(timerObj.prop("interval_id")>=0){
        clearInterval(timerObj.prop("interval_id"));
        timerObj.prop("interval_id", -1);
    }
}

//*************************************************************************************

function secondsToClockFormat(sec_num) {
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var time = "";
    if (hours != "00") {
        time += hours + ":";
    }
    time += minutes + ":" + seconds;
    return time;
}

//*************************************************************************************

$("body").on("TimeOut", function (data) {
   enviarEventoInteraccion("","","","","incorrect",0,2,true, data.sym);
});

$("body").on("TimeAlert", function (data) {
    var nomb = data.timer_obj.prop("nombre");
    data.sym.getSymbol(nomb).play(data.remaining_time);
});
