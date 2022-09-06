/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 43:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 834:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 648:
/***/ ((module) => {

module.exports = eval("require")("discord-webhook-node");


/***/ }),

/***/ 905:
/***/ ((module) => {

module.exports = eval("require")("sharp");


/***/ }),

/***/ 741:
/***/ ((module) => {

module.exports = eval("require")("twitter");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*
1. The core module from the @actions/core package. This is the main module that contains all the functions we’ll be using.
2. The Twitter module from the twitter package. This is the module that will allow us to interact with the Twitter API.
3. The fs module from the fs package. This is the module that will allow us to interact with the file system.
4. The sharp module from the sharp package. This is the module that will allow us to manipulate images.
5. The axios module from the axios package. This is the module that will allow us to make requests.
6. The Webhook module from the discord-webhook-node package. This is the module that will allow us to interact with the Discord API.
7. The exit function from the process package. This is the function that will allow us to exit the script.
*/
const core = __nccwpck_require__(43);
const Twitter = __nccwpck_require__(741)
const fs = __nccwpck_require__(147);
const sharp = __nccwpck_require__(905);
const axios = __nccwpck_require__(834);
const { Webhook } = __nccwpck_require__(648);
const { exit } = __nccwpck_require__(282);

/*
Things I need to do right now:
    * Write a beautiful readme
    * Then blog
    * Bloopers for blog

    Will add in future:
        * A function that will show the reactions on the published release on github in the banner
        * Showing the tags of the repo in the banner
        * Custom Fonts
*/

// CreateImage is a function that will create a dynamic image depending on the data using sharp node module.
function CreateImage() { }
// SendTweet is a function that will send a tweet with banner.
function SendTweet() { }
// SendDiscordMessage is a function that will send a message with a banner.
function SendDiscordMessage() { }

// Using try and catch to prevent failing
try {
    const githubObject = JSON.parse(core.getInput('repo-content-object'));

    // Using UpperCase to prevent any mistakes in the action file
    const ReleaseVersion = core.getInput('release-version').toUpperCase();
    const ActionName = githubObject.event.action.toLowerCase();

    let Emoji;
    let title;

    // started is triggered when someone stars the repository
    if (ActionName === "started") {
        Emoji = fs.readFileSync('./Resources/Emojis/StarEmoji.png');

        // if repository is over 50, or 100, more than that. The title will be adjusted accordingly
        if (githubObject["event"]["repository"]["stargazers_count"] === 50) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 50 Stars`;
        }
        if (githubObject["event"]["repository"]["stargazers_count"] === 100) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 100 Stars`;
        }
        if (githubObject["event"]["repository"]["stargazers_count"] === 500) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 500 Stars`;
        }
        if (githubObject["event"]["repository"]["stargazers_count"] === 1000) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 1k Stars`;
        }
        if (githubObject["event"]["repository"]["stargazers_count"] === 10000) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 10k Stars`;
        }
        if (githubObject["event"]["repository"]["stargazers_count"] === 50000) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 50k Stars`;
        }
        if (githubObject["event"]["repository"]["stargazers_count"] === 100000) {
            title = `${githubObject["repository"].split('/')[1]} have gotten over 100k Stars`;
        }
    } else {
        // Else is when a new release is published
        Emoji = fs.readFileSync('./Resources/Emojis/ConfettiEmoji.png');
        title = `${githubObject["repository"].split('/')[1]} ${ReleaseVersion} is Released`;
    }

    // When there is no star record is broken or no new release is published then program just simply exits
    if (title === "" || title === undefined) {
        console.log("Nothing to do");
        exit();
    }

    // Giving CreateImage() function, three variables, first object which contains data about the repository, second which is finalize title, last is the finalize emoji.
    CreateImage(githubObject, title, Emoji);

    // Using time out, to give CreateImage function to fully create the image before other functions run.
    setTimeout(() => {

        // Running functions accordingly to user's choice of platform.
        const platform = core.getInput("platform").toLowerCase();
        if (platform === "both") {
            SendDiscordMessage(githubObject, title);
            SendTweet(githubObject, title);
        } else if (platform === "discord") {
            SendDiscordMessage(githubObject, title);
        } else {
            SendTweet(githubObject, title);
        }
    }, 10000);
} catch (error) {
    core.setFailed(error.message);
}

// kFormatter is a function that converts a large number into a string, more like github's star count.
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}
// capitalizeFirstLetter is a function that capitalize first letter in the string.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// CreateImage is a function that will create a dynamic image depending on the data using sharp node module.
function CreateImage(data, title, Emoji) {
    let BannerTheme;

    // If user have provided any banner-theme then it sets it, else it defaults to Dark
    if (core.getInput('banner-theme') !== "" && core.getInput('banner-theme') !== undefined) {
        BannerTheme = capitalizeFirstLetter(core.getInput('banner-theme'));
    } else {
        BannerTheme = "Dark";
    }

    let totalContributors = 1;

    // Getting total number of contributors
    axios.get(data['event']['repository']['contributors_url'])
        .then(res => {
            totalContributors = res.data.length;
        })
        .catch(err => {
            console.log(`Error: `, err.message);
        });

    // Using setTimeout to wait until request have fully fetched the data.
    setTimeout(() => {
        let primaryColor = '#fff';
        let secondaryColor = '#ADBFFB';

        if (BannerTheme === "Dark") {
            primaryColor = '#FFFFFF';
            secondaryColor = '#ADBFFB';
        } else if (BannerTheme === "Blue") {
            primaryColor = '#7CC5FF';
            secondaryColor = '#CC7025';
        } else if (BannerTheme === "Orange") {
            primaryColor = '#CC7025';
            secondaryColor = '#7CC5FF';
        }

        // If user have provided custom colors then sets the local variables accordingly
        if (core.getInput("primary-color") !== undefined && core.getInput("primary-color") !== "") {
            primaryColor = core.getInput("primary-color");
        }
        if (core.getInput("secondary-color") !== undefined && core.getInput("secondary-color") !== "") {
            secondaryColor = core.getInput("secondary-color");
        }


        const width = 1012;
        const height = 506;

        const svgImage = `
                    <svg width="${width}" height="${height}">
                        <defs>
                            <style>
                                @font-face {
                                    font-family: IBM Plex Sans;
                                    src: url('./Resources/Fonts/IBMPlexSans-Medium.ttf') format('truetype');
                                         url('./Resources/Fonts/IBMPlexSans-Regular.ttf') format('truetype');
                                }
                                .title { filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); font-family: 'IBM Plex Sans'; fill: ${primaryColor}; font-size: 40px; font-weight: 500;}

                                .number { filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); font-family: 'IBM Plex Sans'; fill: ${secondaryColor}; font-size: 30px; font-weight: 500;}

                                .subheading-bottom { filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); font-family: 'IBM Plex Sans'; fill: ${primaryColor}; font-size: 30px; font-weight: 500;}
                            </style>
                        </defs>

                        <text x="50%" y="45%" text-anchor="middle" class="title">${title}</text>

                        <text x="17%" y="70%" text-anchor="middle" class="number">${kFormatter(totalContributors)}</text>
                        <text x="40%" y="70%" text-anchor="middle" class="number">${kFormatter(data["event"]["repository"]["stargazers_count"])}</text>
                        <text x="59%" y="70%" text-anchor="middle" class="number">${kFormatter(data["event"]["repository"]["forks_count"])}</text>
                        <text x="83%" y="70%" text-anchor="middle" class="number">${kFormatter(data["event"]["repository"]["open_issues_count"])}</text>

                        <text x="50%" y="90%" text-anchor="middle" class="subheading-bottom">${data["repository"]}</text>
                    </svg>
                    `;

        const svgBuffer = Buffer.from(svgImage);

        const customBanner = core.getInput("custom-banner");
        let templateBanner = `./Resources/BannerTemplates/${BannerTheme}.png`;


        // Uses the custom banner, if it is provided by the user.
        if (customBanner !== "" && customBanner !== undefined && customBanner !== " ") {
            templateBanner = customBanner;
        }

        // Merges the svg and the emoji with the template banner
        sharp(templateBanner)
            .composite([
                {
                    input: svgBuffer
                },
                {
                    input: Buffer.from(Emoji),
                    top: 60,
                    left: 1012 / 2
                }
            ])
            .toFile("NeedToResizeImage.png");

        // Wait for a moment until the image is fully produced
        setTimeout(() => {
            // Resize the image to fit the twitter's post image resolution
            sharp(`NeedToResizeImage.png`).resize({
                width: 1012 * 5,
                height: 506 * 5
            }).toFile('outputImage.png');
        }, 2000);
    }, 2000);
}

// SendTweet is a function that will send a tweet with banner.
function SendTweet(githubObject, title) {

    // Getting keys and initializing a new instance of Twitter
    const client = new Twitter({
        consumer_key: core.getInput('twitter-consumer-key'),
        consumer_secret: core.getInput('twitter-consumer-secret'),
        access_token_key: core.getInput('twitter-access-token'),
        access_token_secret: core.getInput('twitter-access-token-secret')
    })

    const imageData = fs.readFileSync("outputImage.png");

    // Posting image with message
    client.post("media/upload", { media: imageData }, function (error, media, response) {
        if (error) {
            console.log(error);
        } else {
            const ActionName = githubObject.event.action.toLowerCase();

            let message;

            // Changing the title depending on the trigger
            if (ActionName === "started") {
                message = `${title} 🌟\n\n${githubObject['event']['repository']['description']}\n\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
            } else {
                message = `${githubObject["repository"].split('/')[1]} ${core.getInput('release-version')} is Released 🎉\n\n${githubObject['event']['repository']['description']}\n\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
            }

            const CustomMessage = core.getInput('custom-message');

            // If user have provided a custom message, then uses it
            if (CustomMessage !== " " && CustomMessage !== "" && CustomMessage !== undefined) {
                message = CustomMessage;
            }

            const status = {
                status: message,
                media_ids: media.media_id_string
            }

            client.post("statuses/update", status, function (error, tweet, response) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`Successfully tweeted!`);
                }
            })
        }
    })

}

// SendDiscordMessage is a function that will send a message with a banner.
function SendDiscordMessage(githubObject, title) {
    // Initializing a Webhook instance
    const hook = new Webhook(core.getInput('discord-webhook-url'));

    const ActionName = githubObject.event.action.toLowerCase();

    let message;

    // Changing the message depending on the trigger
    if (ActionName === "started") {
        message = `**${title} 🌟**\n\n***${githubObject['event']['repository']['description']}***\n\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
    } else {
        message = `**${githubObject["repository"].split('/')[1]} ${core.getInput('release-version')} is Released 🎉 **\n***${githubObject['event']['repository']['description']}***\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
    }

    // Sending the message first
    hook.send(message);
    setTimeout(() => {
        // Then sending the image
        hook.sendFile('./outputImage.png');
    }, 500);
};
})();

module.exports = __webpack_exports__;
/******/ })()
;