(function() {
  "use strict";

  // Cache is storage lives only in memory
  class Cache extends Store {
    getLocalStorageItem() {
      return null;
    }

    saveLocalStorageItem() {
    }
  }

  var cache = new Cache();

  /*
  Client = {
    <screen_name>: [Twitter]
  }
  */
  Cache.addAccessToAccountField('client', (account) => {
    return new Twitter(account.token, account.token_secret);
  });
  cache.extends({
    getTwitterClient: function(account) {
      if (!account || !account.token || !account.token_secret) {
        console.error('[cache] getTwitterClient:', account);
        Notify.error(`[cache] getTwitterClient: ${account.screen_name}`);
        throw "[cache] getTwitterClient: account/token/token_secret is null!";
      }
      return this.getClient(account);
    }
  });

  /*
  Tweet = {
    <screen_name>: {
      <tweet_id>: <Tweet>
    }
  }
  */
  Cache.addAccessToAccountField('tweets', Cache.defaultValueFactoryFactory({}));
  cache.extends({
    getCurrentAccountTweet: function(tweet) {
      var tweets = this.getTweets(document.account);
      if (!(tweet.id in tweets)) {
        tweets[tweet.id] = tweet;
      }
      return tweets[tweet.id];
    },
  });


  // Exported
  document.cache = cache;
})();
