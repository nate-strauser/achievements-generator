Meteor.publish("userData", function () {
	check(arguments, [Match.Any]);
	if(this.userId){
		return [
			Users.find({_id: this.userId}),
			Achievements.find({userId:this.userId}),
			Submissions.find({userId:this.userId}),
			Sessions.find({userId:this.userId})
		];
	}
});