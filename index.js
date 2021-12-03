const core = require('@actions/core');
const github = require('@actions/github');
const Twitter = require('twitter')
const fs = require('fs');
const sharp = require("sharp");
const axios = require('axios');
const { Webhook } = require('discord-webhook-node');
const { exit } = require('process');

/*
Things I need to do right now:
    * Let the user have their own banners with custom colors, you can give them the resolution and other stuff about how to create the banner correctly
    * Improve your doc, tell user how to get the data to make the github action running perfectly
    * Make custom themes for the github stars threshold
    * Add comments to the code if possible
    * Write a beautiful readme
    * Then blog

    Will add in future:
        * A function that will show the reactions on the published release on github in the banner
        * Showing the tags of the repo in the banner
*/


function CreateImage() { }
function SendTweet() { }
function SendDiscordMessage() { }

try {
    const githubObject = JSON.parse(core.getInput('repo-content-object'));

    setTimeout(() => {
        const ReleaseVersion = core.getInput('release-version').toUpperCase();
        const ActionName = core.getInput('action-name').toLowerCase();

        let Emoji;
        let title;
        if (ActionName === "started") {
            Emoji = fs.readFileSync('./Resources/Emojis/StarEmoji.png');

            if (githubObject["event"]["repository"]["stargazers_count"] >= 50) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 50 Stars`;
            }
            if (githubObject["event"]["repository"]["stargazers_count"] >= 100) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 100 Stars`;
            }
            if (githubObject["event"]["repository"]["stargazers_count"] >= 500) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 500 Stars`;
            }
            if (githubObject["event"]["repository"]["stargazers_count"] >= 1000) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 1k Stars`;
            }
            if (githubObject["event"]["repository"]["stargazers_count"] >= 10000) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 10k Stars`;
            }
            if (githubObject["event"]["repository"]["stargazers_count"] >= 50000) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 50k Stars`;
            }
            if (githubObject["event"]["repository"]["stargazers_count"] >= 100000) {
                title = `${githubObject["repository"].split('/')[1]} have gotten over 100k Stars`;
            }
        } else {
            Emoji = fs.readFileSync('./Resources/Emojis/ConfettiEmoji.png');
            title = `${githubObject["repository"].split('/')[1]} ${ReleaseVersion} is Released`;
        }

        if(title===""||title===undefined){
            console.log("Nothing to do");
            exit();
        }

        CreateImage(githubObject, title, Emoji);
        setTimeout(() => {
            const platform = core.getInput("platform").toLowerCase();
            if (platform === "both"){
                SendDiscordMessage(githubObject, title);
                SendTweet(githubObject, title);
            }else if(platform==="discord"){
                SendDiscordMessage(githubObject, title);
            }else{
                SendTweet(githubObject, title);
            }
        }, 10000);
    }, 1000);
} catch (error) {
    core.setFailed(error.message);
}



function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function CreateImage(data, title, Emoji) {
    let BannerTheme;
    if (core.getInput('banner-theme')!==""&&core.getInput('banner-theme')!==undefined) {
        BannerTheme = capitalizeFirstLetter(core.getInput('banner-theme'));
    }else{
        BannerTheme = "Dark";
    }

    let totalContributors;

    axios.get(data['event']['repository']['collaborators_url'])
        .then(res => {
            totalContributors = res.data.length;
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });

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

        if (core.getInput("primary-color")!==undefined&&core.getInput("primary-color")!==""){
            primaryColor = core.getInput("primary-color");
        }
        if (core.getInput("secondary-color")!==undefined&&core.getInput("secondary-color")!==""){
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

        if(customBanner!==""&&customBanner!==undefined&&customBanner!==" ") {
            templateBanner = customBanner;
        }

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

        setTimeout(() => {
            sharp(`NeedToResizeImage.png`).resize({
                width: 1012 * 5,
                height: 506 * 5
            }).toFile('outputImage.png');
        }, 2000);
    }, 1000);
}

function SendTweet(githubObject, title) {
    const client = new Twitter({
        consumer_key: core.getInput('twitter-consumer-key'),
        consumer_secret: core.getInput('twitter-consumer-secret'),
        access_token_key: core.getInput('twitter-access-token'),
        access_token_secret: core.getInput('twitter-access-token-secret')
    })

    const imageData = fs.readFileSync("outputImage.png");

    client.post("media/upload", { media: imageData }, function (error, media, response) {
        if (error) {
            console.log(error)
        } else {
            const ActionName = core.getInput('action-name').toLowerCase();

            let message;

            if (ActionName === "started") {
                message = `${title} 🌟\n\n${githubObject['event']['repository']['description']}\n\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
            } else {
                message = `${githubObject["repository"].split('/')[1]} ${core.getInput('release-version')} is Released 🎉\n\n${githubObject['event']['repository']['description']}\n\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
            }

            const CustomMessage = core.getInput('custom-message');

            if(CustomMessage !== " " && CustomMessage !== ""){
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

function SendDiscordMessage(githubObject, title) {
    const hook = new Webhook(core.getInput('discord-webhook-url'));

    const ActionName = core.getInput('action-name').toLowerCase();

    let message;

    if (ActionName === "started") {
        message = `**${title} 🌟**\n\n***${githubObject['event']['repository']['description']}***\n\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
    } else {
        message = `**${githubObject["repository"].split('/')[1]} ${core.getInput('release-version')} is Released 🎉 **\n***${githubObject['event']['repository']['description']}***\nCheck it out :- ${githubObject['event']['repository']['html_url']}`;
    }

    hook.send(message);
    setTimeout(()=>{
        hook.sendFile('./outputImage.png');
    },500);
};