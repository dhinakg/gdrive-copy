/**********************************************
 * Tracks runtime of application to avoid
 * exceeding Google quotas
 **********************************************/

function Timer() {
  this.START_TIME = new Date().getTime();
  this.runtime = 0;
  this.timeIsUp = false;
  this.stop = false;

  return this;
}

// For a cloud account it doesn't seem to have a max runtime per day limit anymore (previously 90 min, but I think this is for gmail accounts).
// Still setting a limit to 12 hours (= 720 minutes, 20 used for padding) to not ping Google too much
// https://developers.google.com/apps-script/guides/services/quotas
Timer.MAX_RUNTIME_PER_DAY = 700 * 1000 * 60;
Timer.MAX_RUNTIME = 4.7 * 1000 * 60;
// durations used for setting Triggers
Timer.oneDay = 24 * 60 * 60 * 1000;
Timer.sixMinutes = 6.2 * 1000 * 60;

/**
 * Update current time
 * @param {UserPropertiesService} userProperties
 */
Timer.prototype.update = function(userProperties) {
  this.runtime = this.now() - this.START_TIME;
  this.timeIsUp = this.runtime >= Timer.MAX_RUNTIME;
  this.stop = userProperties.getProperty('stop') == 'true';
};

/**
 * @returns {boolean}
 */
Timer.prototype.canContinue = function() {
  return !this.timeIsUp && !this.stop;
};

/**
 * @returns {number}
 */
Timer.prototype.now = function() {
  return new Date().getTime();
};

/**
 * Calculate how far in the future the trigger should be set
 * @param {Properties} properties
 * @returns {number}
 */
Timer.prototype.calculateTriggerDuration = function(properties) {
  return properties.checkMaxRuntime()
    ? Timer.oneDay
    : Timer.sixMinutes - this.runtime;
};

//removeIf(production)
// Google Apps Script doesn't play well with module.exports,
// but it is required for testing
module.exports = Timer;
//endRemoveIf(production)
