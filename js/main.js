RdioTrack = Backbone.Model.extend({});

ThisIsMyJamTrack = Backbone.Model.extend({});

RdioTrackView = Backbone.View.extend({
  el: $('#rdio-track'),

  template: _.template($('#rdio-track-template').html()),

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    var artistName = this.model.get('artist');
    var trackName = this.model.get('name');
    var query = artistName + " " + trackName;
    var postUrl = "http://www.thisismyjam.com/jam/create?search=" + encodeURIComponent(query);

    var templateContext = {
      url: postUrl,
      track: this.model.toJSON()
    }
    this.$el.html(this.template(templateContext));
    return this;
  }
});

var getPlayingTrackInfo = function() {
  var playingTrack = R.player.playingTrack();
  if (playingTrack) {
    return playingTrack.attributes;
  } else {
    return {}
  }
}


var main = function() {
  if (!rdioUtils.startupChecks()) {
    return;
  }

  var rdioTrack = new RdioTrack;
  var rdioTrackView = new RdioTrackView({
    model: rdioTrack
  });

  R.ready(function() {
    rdioUtils.authWidget($('#authenticate'));

    rdioTrack.set(getPlayingTrackInfo());
    R.player.on('change:playingTrack', function() {
      rdioTrack.set(getPlayingTrackInfo());
    });
  });
}

main();
