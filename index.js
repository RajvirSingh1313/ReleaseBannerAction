const core = require('@actions/core');
const github = require('@actions/github');
const Twitter =  require('twitter')
const fs = require('fs');
const sharp = require("sharp");

try {
    const client = new Twitter({
        consumer_key: core.getInput('consumer-key'),
        consumer_secret: core.getInput('consumer-secret'),
        access_token_key: core.getInput('access-token'),
        access_token_secret: core.getInput('access-token-secret')
    })

    const githubObject = core.getInput('repo-content-object')
    
    const width = 7680;
    const height = 3068;

    const svgImage = `
                <svg width="${width}" height="${height}">
                    <defs>
                        <style>
                            @font-face {
                                font-family: IBM Plex Sans;
                                src: url('./Resources/Fonts/IBMPlexSans-Medium.ttf') format('truetype');
                                     url('./Resources/Fonts/IBMPlexSans-Regular.ttf') format('truetype');
                            }
                            .title { font-family: 'IBM Plex Sans'; fill: #fff; font-size: 400px; font-weight: 500;}

                            .number { font-family: 'IBM Plex Sans'; fill: #fff; font-size: 200px; font-weight: 500;}

                            .subheading-bottom { font-family: 'IBM Plex Sans'; fill: #fff; font-size: 200px; font-weight: 500;}
                        </style>
                    </defs>

                    <text x="50%" y="45%" text-anchor="middle" class="title">TwitterBannerAction v2.1 Release Out</text>

                    <text x="17%" y="71%" text-anchor="middle" class="number">12</text>
                    <text x="43%" y="71%" text-anchor="middle" class="number">17</text>
                    <text x="64%" y="71%" text-anchor="middle" class="number">187</text>
                    <text x="86%" y="71%" text-anchor="middle" class="number">2</text>

                    <text x="50%" y="96%" text-anchor="middle" class="subheading-bottom">RajvirSingh1313/TwitterBannerAction</text>
                </svg>
                `;

    const svgBuffer = Buffer.from(svgImage);
    const emoji = fs.readFileSync('./Resources/emoji.svg');
    sharp("./Resources/BannerTemplates/Dark.png")
        .composite([
            {
                input: svgBuffer
            },
            {
                input: Buffer.from(emoji),
                top: 400,
                left: 7680 / 2
            }
        ])
        .toFile("outputImage.png");
    const imageData = fs.readFileSync("outputImage.png");

    client.post("media/upload", { media: imageData }, function (error, media, response) {
        if (error) {
            console.log(error)
        } else {
            const status = {
                status: core.getInput('status'),
                media_ids: media.media_id_string
            }

            client.post("statuses/update", status, function (error, tweet, response) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`Successfully tweeted an image!`)
                }
            })
        }
    })

} catch (error) {
    core.setFailed(error.message);
}