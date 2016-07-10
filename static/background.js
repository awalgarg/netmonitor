/*
 * stuff to do:
 *
 * # listen to tab change event
 * # when tab is changed, get the number of requests and status of tabid and update browseraction
 *
 * # listen to webrequest onbeforerequestsent
 * # update tab db
 * # if tabid is activetabid, update browseraction
 *
 * eaaaasy!
 *
 * awal rocks
 */

const TAB_DB /*: { [tabId: number]: [number, number] } */ = new Map();

init();

function init() /*: void */ {
	const filter = { urls: [ "<all_urls>" ] };
	chrome.tabs.onActivated.addListener(onTabSwitch);
	chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, filter);
	chrome.webRequest.onCompleted.addListener(onRequestCompletedOrErrored, filter);
	chrome.webRequest.onErrorOccurred.addListener(onRequestCompletedOrErrored, filter);
	chrome.webNavigation.onCommitted.addListener(resetTabState, filter);
}

function onTabSwitch({ tabId /*: number */ }) /*: void */ {
	const tabData /*: [number, number] */ = getTabData(tabId);
	updateView(tabData);
}

function onBeforeRequest({ tabId /*: number */ }) /*: void */ {
	incrementTabTimesCurrentlyDoing(tabId);
	incrementTabTimesAlreadyDone(tabId);
	conditionallyUpdateView(tabId);
}

function onRequestCompletedOrErrored({ tabId /*: number */ }) /*: void */ {
	decrementTabTimesCurrentlyDoing(tabId);
	conditionallyUpdateView(tabId);
}

function resetTabState({ tabId /*: number */ }) /*: void */ {
	const newTabState = [0, 0];
	TAB_DB.set(tabId, newTabState);
	conditionallyUpdateView(tabId);
}

function conditionallyUpdateView(tabId) {
	getCurrentlyViewedTabId()
		.then(activeTabId /*: number */ => {
			if (activeTabId === tabId) {
				const tabData = getTabData(tabId);
				updateView(tabData);
			}
		});
}

function updateView([timesCurrentlyDoing /*: number */, timesAlreadyDone /*: number */]) /*: void */ {
	chrome.browserAction.setBadgeText({ text: String(timesAlreadyDone) });
	if (timesCurrentlyDoing > 0) {
		chrome.browserAction.setIcon({ path: 'static/on.gif' });
	} else {
		chrome.browserAction.setIcon({ path: 'static/off.png' });
	}
}

function getCurrentlyViewedTabId() /*: Promise<number> */ {
	return new Promise(resolve => {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([ { id /*: number */ } ]) => {
			resolve(id);
		});
	});
}

function getTabData(tabId /*: number */) /*: [number, number] */ {
	if (TAB_DB.has(tabId)) {
		return TAB_DB.get(tabId);
	}
	const tabData = [0, 0];
	TAB_DB.set(tabId, tabData);
	return tabData;
}

function incrementTabTimesCurrentlyDoing(tabId /*: number */) /*: void */ {
	const tabData /*: [number, number] */ = getTabData(tabId);
	tabData[0] += 1;
}

function decrementTabTimesCurrentlyDoing(tabId /*: number */) /*: void */ {
	const tabData /*: [number, number] */ = getTabData(tabId);
	tabData[0] -= 1;
}

function incrementTabTimesAlreadyDone(tabId /*: number */) /*: void */ {
	const tabData /*: [number, number] */ = getTabData(tabId);
	tabData[1] += 1;
}
