Session.setDefault('hoursOffset', 0);

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  yieldTemplates:{
    header:{to:'header'},
    footer:{to:'footer'}
  }
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('dashboard', {
    path: '/dashboard',
    data: function () {
      return {
        recentSubmissions:Submissions.find({},{sort:{timestamp:-1},limit:5}),
        recentAchievements:Achievements.find({},{sort:{timestamp:-1},limit:5}),
        recentSessions:Sessions.find({},{sort:{timestamp:-1},limit:5})
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('submit', {
    path: '/submit',
    data: function () {
      return {
        recentSubmissions:Submissions.find({},{sort:{timestamp:-1},limit:10}),
        recentAchievements:Achievements.find({},{sort:{timestamp:-1},limit:10}),
        currentSession:Sessions.findOne({endTimestamp:null}),
        recentSessions:Sessions.find({},{sort:{timestamp:-1},limit:10}),
        user:Users.findOne({_id:Meteor.userId()}),
        submissionsCount:Submissions.find({}).count(),
        achievementsCount:Achievements.find({}).count(),
        sessionsCount:Sessions.find({}).count()
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('submissions', {
    path: '/submissions',
    data: function () {
      return {
        submissions:Submissions.find({},{sort:{timestamp:-1}})
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('submission', {
    path: '/submissions/:_id',
    data: function () {
      return {
        submission:Submissions.findOne({_id:this.params._id}),
        achievements:Achievements.find({submissionId:this.params._id}),
        achievementsCount:Achievements.find({submissionId:this.params._id}).count()
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('sessions', {
    path: '/sessions',
    data: function () {
      return {
        sessions:Sessions.find({},{sort:{timestamp:-1}})
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('session', {
    path: '/sessions/:_id',
    data: function () {
      return {
        session:Sessions.findOne({_id:this.params._id}),
        achievements:Achievements.find({sessionId:this.params._id}),
        achievementsCount:Achievements.find({sessionId:this.params._id}).count(),
        submissions:Submissions.find({sessionId:this.params._id}),
        submissionsCount:Submissions.find({sessionId:this.params._id}).count()
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('achievements', {
    path: '/achievements',
    data: function () {
      return {
        achievements:Achievements.find({},{sort:{timestamp:-1}})
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

  this.route('achievement', {
    path: '/achievements/:_id',
    data: function () {
      return {
        achievement:Achievements.findOne({_id:this.params._id})
      };
    },
    waitOn: function(){
      return subscriptionHandle;
    }
  });

});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

AccountsEntry.config({
  homeRoute: '/',
  dashboardRoute: '/dashboard'
});