// ==UserScript==
// @name         Seriesfeed Favourites Dropdown
// @namespace    https://www.seriesfeed.com
// @version      1.0
// @description  Choose your favourites from a dropdown on any page, just like Bierdopje!
// @updateURL 	 https://github.com/TomONeill/seriesfeed-favourites/raw/master/seriesfeed-favourites-dropdown.latest.user.js
// @match        https://www.seriesfeed.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       Tom
// @copyright    2018+, Tom
// ==/UserScript==
/* jshint -W097 */
/* global $, console, GM_xmlhttpRequest */
'use strict';

/*
TODO:
- Cache favourites for quicker loading > add/remove to cache when adding/removing a favourite.
- Enable keyboard input to select a favourite from the list.
*/

$(() => {
	const _baseUrl = "https://www.seriesfeed.com";
	const username = getUsername();

	ajaxGet(`${_baseUrl}/users/${username}/favourites`)
		.then((page) => {
		const favourites = $(page).find("#favourites tr td:nth-child(2) a");
		const starDropdown = getStarDropdown();
		$('.main-menu .new-message').after(starDropdown.topLevel);

		favourites.each((index, favourite) => {
			const favName = $(favourite).text();
			const favSlug = $(favourite).attr("href");
			const showItem = $("<li/>").append($("<a/>").attr("href", _baseUrl + favSlug).text(favName));
			starDropdown.dropdown.append(showItem);
		});
	});

	function getUsername() {
		const userLink = $('.main-menu .profile-li .main-menu-dropdown li:first-child a').attr('href');
		const userLinkParts = userLink.split('/');
		return userLinkParts[2];
	}

	function ajaxGet(url) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				onload: (pageData) => {
					resolve(pageData.responseText);
				},
				onerror: (error) => {
					reject(error);
				}
			});
		});
	}

	function getStarDropdown() {
		const topLevel = $("<li/>").addClass("top-level upper favourites-li");
		const topLevelToggle = $("<a/>").addClass("top-level-toggle");
		const starIcon = $("<i/>").addClass("fa fa-star-o");
		topLevel.append(topLevelToggle);
		topLevelToggle.append(starIcon);

		const mainMenuDropdown = $("<ul/>").addClass("main-menu-dropdown");
		const scrollContainer = $("<li/>").addClass("scrollContainer");
		mainMenuDropdown.append(scrollContainer);
		topLevel.append(mainMenuDropdown);

		return { topLevel: topLevel, dropdown: scrollContainer };
	}
});