var getAndSetHoursOffset = function(){
  var hoursOffset = parseInt($("#hoursOffset").val(), 10);
  if(isNaN(hoursOffset) || hoursOffset < 0)
    hoursOffset = 0;
  $("hoursOffset").val(hoursOffset);
  Session.set('hoursOffset', hoursOffset);
  return hoursOffset
};

Template.submit.events({
    'click #newSubmission' : function () {
      //console.log('new submission');
      var hoursOffset = getAndSetHoursOffset();
      Meteor.call('performSubmit', hoursOffset, function(error, result){
        if(error)
                console.error(error);
        //console.log(result);
        Meteor.call('processAchievements', result, hoursOffset, function(error, result){
            if(error)
                console.error(error);
            if(result && result.length > 0)
              console.log('you just earned achievements ' + JSON.stringify(result));
        });

      });
    },
    'click #newSession' : function () {
      //console.log('new session');
      var hoursOffset = getAndSetHoursOffset();
      Meteor.call('startNewSession', hoursOffset, function(error, result){
          if(error)
              console.error(error);
      });
    },
    'submit #submitForm' : function(e){
      //console.log('preventing submit');
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
});