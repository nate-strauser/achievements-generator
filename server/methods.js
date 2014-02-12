var notYetEarnedToday = function(key, userId, baseMoment){
	return Achievements.find({
		userId:userId,
		key:key,
		timestamp:{
			$gte: baseMoment.toDate().getTime(),
			$lte: baseMoment.clone().add('days', 1).toDate().getTime()
		}
	}).count() === 0;
};

var submitedDaysAgo = function(days, userId, baseMoment){
	return Submissions.find({
		userId:userId,
		timestamp:{
			$gte: baseMoment.clone().subtract('days', days).toDate().getTime(),
			$lte: baseMoment.clone().subtract('days', days - 1).toDate().getTime()
		}
	}).count() > 0;
};

var achievements = {
	version:1,
	available:[
		{
			title:'5 First Submissions',
			message:'You completed your first 5 submissions!',
			key:'first-5',
			multiple:false,
			earned:function(previousSubmissions){
				return previousSubmissions.count() === 5;
			}
		},
		{
			title:'25 First Submissions',
			message:'You completed your first 25 submissions!',
			key:'first-25',
			multiple:false,
			earned:function(previousSubmissions){
				return previousSubmissions.count() === 25;
			}
		},
		{
			title:'100 Cumulative Submissions',
			message:'Wow, you reached 100 Cumulative Submissions!',
			key:'cumulative-100',
			multiple:false,
			earned:function(previousSubmissions){
				return previousSubmissions.count() === 100;
			}
		},
		{
			title:'1000 Cumulative Submissions',
			message:'Wow, you reached 1000 Cumulative Submissions!',
			key:'cumulative-1000',
			multiple:false,
			earned:function(previousSubmissions){
				return previousSubmissions.count() === 1000;
			}
		},
		{
			title:'2000 Cumulative Submissions',
			message:'Wow, you reached 2000 Cumulative Submissions!',
			key:'cumulative-2000',
			multiple:false,
			earned:function(previousSubmissions){
				return previousSubmissions.count() === 2000;
			}
		},
		{
			title:'5000 Cumulative Submissions',
			message:'Wow, you reached 5000 Cumulative Submissions!',
			key:'cumulative-5000',
			multiple:false,
			earned:function(previousSubmissions){
				return previousSubmissions.count() === 5000;
			}
		},
		{
			title:'50 in a row',
			message:'Wow, you did 50 in a row!',
			key:'streak-50',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission){
				return previousSubmissions.count({sessionId:lastSubmission.sessionId}) === 50;
			}
		},
		{
			title:'100 in a row',
			message:'Wow, you did 100 in a row!',
			key:'streak-100',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission){
				return previousSubmissions.count({sessionId:lastSubmission.sessionId}) === 100;
			}
		},
		{
			title:'200 in a row',
			message:'Wow, you did 200 in a row!',
			key:'streak-200',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission){
				return previousSubmissions.count({sessionId:lastSubmission.sessionId}) === 200;
			}
		},
		{
			title:'Personal Best',
			message:'Wow, you beat your personal best streak!',
			key:'streak-best',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission){
				//TODO - this message gets displayed on each submit - seems like might be better on session sign out

				var user = Users.findOne({_id:lastSubmission.userId});
				var personalBest = user.profile.longestStreak || 0;
				var currentStreakCount = previousSubmissions.count({sessionId:lastSubmission.sessionId});
				var newPersonalBest = currentStreakCount > personalBest;

				if(newPersonalBest){
					Users.update({_id:user._id},{$set:{'profile.longestStreak':currentStreakCount}});

					//TODO - the message could be nicer, holding some custom digits/text >> this.message = this.messasgeTemplate += currentStreakCount;
				}

				return newPersonalBest;
			}
		},
		{
			title:'2 Days in a row',
			message:'Welcome back, you have submitted 2 days in a row!',
			key:'days-2',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission, baseMoment){

				//var baseMoment = moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
				return notYetEarnedToday(this.key, lastSubmission.userId, baseMoment) 
					&& submitedDaysAgo(1, lastSubmission.userId, baseMoment)
					&& !submitedDaysAgo(2, lastSubmission.userId, baseMoment); //prevent re-earning during days in a row
			}
		},
		{
			title:'3 Days in a row',
			message:'Welcome back, you have submitted 3 days in a row!',
			key:'days-3',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission, baseMoment){
				//var baseMoment = moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
				return notYetEarnedToday(this.key, lastSubmission.userId, baseMoment) 
					&& submitedDaysAgo(1, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(2, lastSubmission.userId, baseMoment)
					&& !submitedDaysAgo(3, lastSubmission.userId, baseMoment);//prevent re-earning during days in a row
			}
		},
		{
			title:'10 Days in a row',
			message:'Welcome back, you have submitted 10 days in a row!',
			key:'days-10',
			multiple:true,
			earned:function(previousSubmissions, lastSubmission, baseMoment){
				//var baseMoment = moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
				return notYetEarnedToday(this.key, lastSubmission.userId, baseMoment) 
					&& submitedDaysAgo(1, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(2, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(3, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(4, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(5, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(6, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(7, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(8, lastSubmission.userId, baseMoment)
					&& submitedDaysAgo(9, lastSubmission.userId, baseMoment)
					&& !submitedDaysAgo(10, lastSubmission.userId, baseMoment);//prevent re-earning during days in a row
			}
		}
	]
};

Meteor.startup(function () {
	Meteor.methods({
		processAchievements: function (submissionId, hoursOffset) {
			var userId = this.userId;
			//console.log('processing for submissionId ' + submissionId);
			var lastSubmission = Submissions.findOne({_id:submissionId});
			var previousSubmissions = Submissions.find({userId:userId,timestamp:{$lte:lastSubmission.timestamp}}).fetch();
			var previousAchievements = Achievements.find({userId:userId,timestamp:{$lte:lastSubmission.timestamp}}).fetch();
			var currentSession = Sessions.findOne({userId:userId, endTimestamp:null});
			var baseMoment = moment().add('hours', hoursOffset).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
			var earnedAchievements = [];

			achievements.available.forEach(function(achievement){
				var achievementEarned = achievement.earned(previousSubmissions, lastSubmission, baseMoment);
				var achievementEarnedAgain = achievementEarned && (!achievement.multiple || previousAchievements.count({key:achievement.key}) > 0);
				if(achievementEarned || achievementEarnedAgain){
					earnedAchievements.push(Achievements.insert({
						userId:userId,
						timestamp:moment().add('hours', hoursOffset).toDate().getTime(),
						version:achievements.version,
						title:achievement.title,
						message:achievement.message,
						key:achievement.key,
						submissionId:submissionId,
						sessionId:currentSession._id
					}));
				}
			});

			return earnedAchievements;
		},
		performSubmit: function (hoursOffset) {
			var userId = this.userId;
			var currentSession = Sessions.findOne({userId:userId, endTimestamp:null});
			Sessions.update({_id:currentSession._id},{$inc:{submissionCount:1}});
	        return Submissions.insert({
				userId:userId,
				timestamp:moment().add('hours', hoursOffset).toDate().getTime(),
				sessionId:currentSession._id
	        });
		},
		startNewSession: function (hoursOffset) {
			//NOTE - using sessions to track 'usage periods' rather than time for easy testing
			var userId = this.userId;
			var currentSession = Sessions.findOne({userId:userId, endTimestamp:null});
			var count = 1;
			if(currentSession){
				Sessions.update({_id:currentSession._id},{$set:{
					endTimestamp:moment().add('hours', hoursOffset).toDate().getTime()
				}});
				count = currentSession.count + 1;
			}
			Sessions.insert({
				userId:userId,
				timestamp:moment().add('hours', hoursOffset).toDate().getTime(),
				count:count,
				submissionCount:0
			});
		}
   });
});