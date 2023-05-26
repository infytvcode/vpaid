/**
 * @fileoverview A VPAID ad useful for testing functionality of the sdk.
 *
 * @author nayan@infy.tv (Nayan)
 */



/**
 * @constructor
 */
var VpaidAd = function() {
  // The slot is the div element on the main page that the ad is supposed to
  // occupy.
  this.slot_ = null;
  // The video slot is the video object that the creative can use to render the
  // video element it might have.
  this.videoSlot_ = null;
  // An object containing all registered events.  These events are all
  // callbacks from the vpaid ad.
  this.eventCallbacks_ = {};
  // A list of attributes getable and setable.
  this.attributes_ = {
    'companions': '',
    'desiredBitrate': 256,
    'duration': 30,
    'expanded': false,
    'height': 0,
    'icons': '',
    'linear': true,
    'remainingTime': 10,
    'skippableState': true,
    'viewMode': 'normal',
    'width': 0,
    'volume': 50
  };
};


/**
 * VPAID defined init ad, initializes all attributes in the ad.  Ad will
 * not start until startAd is called.
 *
 * @param {number} width The ad width.
 * @param {number} height The ad heigth.
 * @param {string} viewMode The ad view mode.
 * @param {number} desiredBitrate The desired bitrate.
 * @param {Object} creativeData Data associated with the creative.
 * @param {Object} environmentVars Variables associated with the creative like
 *     the slot and video slot.
 */
VpaidAd.prototype.initAd = function(
  width,
  height,
  viewMode,
  desiredBitrate,
  creativeData,
  environmentVars) {
  // slot and videoSlot are passed as part of the environmentVars
  this.slot_ = environmentVars.slot;
  this.videoSlot_ = environmentVars.videoSlot;
  this.attributes_['width'] = width;
  this.attributes_['height'] = height;
  this.attributes_['viewMode'] = viewMode;
  this.attributes_['desiredBitrate'] = desiredBitrate;

  var data = JSON.parse(creativeData['AdParameters']);
  this.log('data', data)
  this.attributes_['publisher_id'] = data.publisher_id || 1094;
  this.attributes_['tag_id'] = data.tag_id || 2084;
  this.log('initAd - publisher_id_' + this.attributes_['publisher_id'] + 'tag_id_' + this.attributes_['tag_id']);
  this.log('initAd ' + width + 'x' + height +
    ' ' + viewMode + ' ' + desiredBitrate);
  this.renderSlot_();
  // this.addButtonListeners_();
  // this.fillProperties_();
  this.eventCallbacks_['AdLoaded']();
};


/**
 * Populates the inner html of the slot.
 * @private
 */
VpaidAd.prototype.renderSlot_ = function() {
  var slotExists = this.slot_ && this.slot_.tagName === 'DIV';
  if (!slotExists) {
    this.slot_ = document.createElement('div');
    if (!document.body) {
      document.body = /**@type {HTMLDocument}*/ document.createElement('body');
    }
    document.body.appendChild(this.slot_);
  }
  // this.slot_.innerHTML = '<div style="width: 300px;height: 600px;" id="gen_ext" data-id="p_house_drogon" data-ad="true" data-c-id="1094" data-t-id="2084" data-test="true" data-domain="terminaltrend.io" data-publisher-name="Terminal Trend" data-ad-creative="true"></div>';
  var cxr = document.createElement('div');
  cxr.setAttribute("id", "gen_ext");
  cxr.setAttribute("data-id", "p_house_drogon");
  cxr.setAttribute("data-ad", "true");
  cxr.setAttribute("data-c-id", "1094");
  cxr.setAttribute("data-t-id", "2084");
  cxr.setAttribute("data-test", "true");
  cxr.setAttribute("data-ad-creative", "true");
  document.body.appendChild(cxr);

  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", "https://dp1ii9c1a0cgb.cloudfront.net/static/extension/infy_ext.min.js");
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", true);

  document.body.appendChild(scriptEle);

  // success event 
  scriptEle.addEventListener("load", () => {
    console.log("CXR File loaded")
  });
  // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading CXR file", ev);
  });
};


/**
 * Adds all listeners to buttons.
 * @private
 */
// VpaidAd.prototype.addButtonListeners_ = function() {
//   var eventSelect = document.getElementById('eventSelect');
//   eventSelect.addEventListener('change', this.eventSelected_.bind(this));

//   var triggerEvent = document.getElementById('triggerEvent');
//   triggerEvent.addEventListener('click', this.triggerEvent_.bind(this));
// };


/**
 * Triggers an event.
 * @private
 */
// VpaidAd.prototype.triggerEvent_ = function() {
//   var eventSelect = document.getElementById('eventSelect');
//   var value = eventSelect.value;
//   if (value == 'AdClickThru') {
//     this.adClickThruHandler_();
//   } else if (value == 'AdError') {
//     this.adErrorHandler_();
//   } else if (value == 'AdLog') {
//     this.adLogHandler_();
//   } else if (value == 'AdInteraction') {
//     this.adInteractionHandler_();
//   } else if (value in this.eventCallbacks_) {
//     this.eventCallbacks_[value]();
//   }
// };


/**
 * Returns the versions of vpaid ad supported.
 * @param {string} version
 * @return {string}
 */
VpaidAd.prototype.handshakeVersion = function(version) {
  return ('2.0');
};


/**
 * Called by the wrapper to start the ad.
 */
VpaidAd.prototype.startAd = function() {
  this.log('Starting ad');
  if ('AdStart' in this.eventCallbacks_) {
    this.eventCallbacks_['AdStarted']();
  }
};


/**
 * Called by the wrapper to stop the ad.
 */
VpaidAd.prototype.stopAd = function() {
  this.log('Stopping ad');
  if ('AdStop' in this.eventCallbacks_) {
    this.eventCallbacks_['AdStopped']();
  }
};


/**
 * @param {number} value The volume in percentage.
 */
VpaidAd.prototype.setAdVolume = function(value) {
  this.attributes_['volume'] = value;
  this.log('setAdVolume ' + value);
  if ('AdVolumeChange' in this.eventCallbacks_) {
    this.eventCallbacks_['AdVolumeChange']();
  }
};


/**
 * @return {number} The volume of the ad.
 */
VpaidAd.prototype.getAdVolume = function() {
  this.log('getAdVolume');
  return this.attributes_['volume'];
};


/**
 * @param {number} width The new width.
 * @param {number} height A new height.
 * @param {string} viewMode A new view mode.
 */
VpaidAd.prototype.resizeAd = function(width, height, viewMode) {
  this.log('resizeAd ' + width + 'x' + height + ' ' + viewMode);
  this.attributes_['width'] = width;
  this.attributes_['height'] = height;
  this.attributes_['viewMode'] = viewMode;
  if ('AdSizeChange' in this.eventCallbacks_) {
    this.eventCallbacks_['AdSizeChange']();
  }
};


/**
 * Pauses the ad.
 */
VpaidAd.prototype.pauseAd = function() {
  this.log('pauseAd');
  if ('AdPaused' in this.eventCallbacks_) {
    this.eventCallbacks_['AdPaused']();
  }
};


/**
 * Resumes the ad.
 */
VpaidAd.prototype.resumeAd = function() {
  this.log('resumeAd');
  if ('AdResumed' in this.eventCallbacks_) {
    this.eventCallbacks_['AdResumed']();
  }
};


/**
 * Expands the ad.
 */
VpaidAd.prototype.expandAd = function() {
  this.log('expandAd');
  this.attributes_['expanded'] = true;
  if ('AdExpanded' in this.eventCallbacks_) {
    this.eventCallbacks_['AdExpanded']();
  }
};


/**
 * Returns true if the ad is expanded.
 *
 * @return {boolean}
 */
VpaidAd.prototype.getAdExpanded = function() {
  this.log('getAdExpanded');
  return this.attributes_['expanded'];
};


/**
 * Returns the skippable state of the ad.
 *
 * @return {boolean}
 */
VpaidAd.prototype.getAdSkippableState = function() {
  this.log('getAdSkippableState');
  return this.attributes_['skippableState'];
};


/**
 * Collapses the ad.
 */
VpaidAd.prototype.collapseAd = function() {
  this.log('collapseAd');
  this.attributes_['expanded'] = false;
};


/**
 * Skips the ad.
 */
VpaidAd.prototype.skipAd = function() {
  this.log('skipAd');
  var skippableState = this.attributes_['skippableState'];
  if (skippableState) {
    if ('AdSkipped' in this.eventCallbacks_) {
      this.eventCallbacks_['AdSkipped']();
    } else {
      this.log('Error: Invalid ad skip request.');
    }
  }
};


/**
 * Registers a callback for an event.
 * @param {Function} aCallback The callback function.
 * @param {string} eventName The callback type.
 * @param {Object} aContext The context for the callback.
 */
VpaidAd.prototype.subscribe = function(aCallback, eventName, aContext) {
  this.log('Subscribe ' + aCallback);
  var callBack = aCallback.bind(aContext);
  this.eventCallbacks_[eventName] = callBack;
};


/**
 * Removes a callback based on the eventName.
 *
 * @param {string} eventName The callback type.
 */
VpaidAd.prototype.unsubscribe = function(eventName) {
  this.log('unsubscribe ' + eventName);
  this.eventCallbacks_[eventName] = null;
};


/**
 * @return {number} The ad width.
 */
VpaidAd.prototype.getAdWidth = function() {
  return this.attributes_['width'];
};


/**
 * @return {number} The ad height.
 */
VpaidAd.prototype.getAdHeight = function() {
  return this.attributes_['height'];
};


/**
 * @return {number} The time remaining in the ad.
 */
VpaidAd.prototype.getAdRemainingTime = function() {
  return this.attributes_['remainingTime'];
};


/**
 * @return {number} The duration of the ad.
 */
VpaidAd.prototype.getAdDuration = function() {
  return this.attributes_['duration'];
};


/**
 * @return {string} List of companions in vast xml.
 */
VpaidAd.prototype.getAdCompanions = function() {
  return this.attributes_['companions'];
};


/**
 * @return {string} A list of icons.
 */
VpaidAd.prototype.getAdIcons = function() {
  return this.attributes_['icons'];
};


/**
 * @return {boolean} True if the ad is a linear, false for non linear.
 */
VpaidAd.prototype.getAdLinear = function() {
  return this.attributes_['linear'];
};


/**
 * Logs events and messages.
 *
 * @param {string} message
 */
VpaidAd.prototype.log = function(message) {
  var logTextArea = document.getElementById('lastVpaidEvent');
  if (logTextArea != null) {
    logTextArea.value = message;
  }
};


/**
 * Callback for AdClickThru button.
 *
 * @private
 */
VpaidAd.prototype.adClickThruHandler_ = function() {
  if (!this.isEventSubscribed_('AdClickThru')) {
    this.log('Error: AdClickThru function callback not subscribed.');
    return;
  }
  var clickThruUrl = document.getElementById('clickThruUrl').value;
  var clickThruId = document.getElementById('clickThruId').value;
  var clickThruPlayerHandles =
    document.getElementById('clickThruPlayerHandels').value;
  this.log('AdClickThu(' + clickThruUrl + ',' +
    clickThruId + ',' + clickThruPlayerHandles + ')');
  this.eventCallbacks_['AdClickThru'](
    clickThruUrl,
    clickThruId,
    clickThruPlayerHandles);
};


/**
 * Callback for AdError button.
 *
 * @private
 */
VpaidAd.prototype.adErrorHandler_ = function() {
  if (!this.isEventSubscribed_('AdError')) {
    this.log('AdError function callback not subscribed.');
    return;
  }
  var adError = document.getElementById('adErrorMsg').value;
  this.log('adError(' + adError + ')');
  this.eventCallbacks_['AdError'](adError);
};


/**
 * Callback for AdLogMsg button.
 *
 * @private
 */
VpaidAd.prototype.adLogHandler_ = function() {
  if (!this.isEventSubscribed_('AdLog')) {
    this.log('Error: AdLog function callback not subscribed.');
    return;
  }
  var adLogMsg = document.getElementById('adLogMsg').value;
  this.log('adLog(' + adLogMsg + ')');
  this.eventCallbacks_['AdLog'](adLogMsg);
};


/**
 * Callback for AdInteraction button.
 *
 * @private
 */
VpaidAd.prototype.adInteractionHandler_ = function() {
  if (!this.isEventSubscribed_('AdInteraction')) {
    this.log('Error: AdInteraction function callback not subscribed.');
    return;
  }
  var adInteraction = document.getElementById('adInteractionId').value;
  this.log('adLog(' + adInteraction + ')');
  this.eventCallbacks_['AdInteraction'](adInteraction);
};


/**
 * Callback function when an event is selected from the dropdown.
 *
 * @private
 */
VpaidAd.prototype.eventSelected_ = function() {
  var clickThruParams = document.getElementById('AdClickThruOptions');
  var adErrorParams = document.getElementById('AdErrorOptions');
  var adLogParams = document.getElementById('AdLogOptions');
  var adInteractionParams = document.getElementById('AdInteractionOptions');
  clickThruParams.style.display = 'none';
  adErrorParams.style.display = 'none';
  adLogParams.style.display = 'none';
  adInteractionParams.style.display = 'none';

  var eventSelect = document.getElementById('eventSelect');
  var value = eventSelect.value;
  if (value == 'AdClickThru') {
    clickThruParams.style.display = 'inline';
  } else if (value == 'AdError') {
    adErrorParams.style.display = 'inline';
  } else if (value == 'AdLog') {
    adLogParams.style.display = 'inline';
  } else if (value == 'AdInteraction') {
    adInteractionParams.style.display = 'inline';
  }
};


/**
 * @param {string} eventName
 * @return {Boolean} True if this.eventCallbacks_ contains the callback.
 * @private
 */
VpaidAd.prototype.isEventSubscribed_ = function(eventName) {
  return typeof (this.eventCallbacks_[eventName]) === 'function';
};


/**
 * Populates all of the vpaid ad properties.
 *
 * @private
 */
VpaidAd.prototype.fillProperties_ = function() {
  for (var key in this.attributes_) {
    var span = document.getElementById(key);
    span.textContent = this.attributes_[key];
  }
};


/**
 * Main function called by wrapper to get the vpaid ad.
 *
 * @return {Object}
 */
var getVPAIDAd = function() {
  return new VpaidAd();
};