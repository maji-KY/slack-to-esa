/*
Description:
  特定のリアクションがついたメッセージをesaに投稿する

Notes:
  Slackだと流れていってしまう作業メモなどをesaに書きとめておく
  環境変数にesaのアクセストークン,チーム名,投稿カテゴリ,リアクション名を設定しておく
    `ESA_ACCESS_TOKEN=xxx`
    `ESA_TEAM_NAME=yyy`
    `ESA_BOT_CATEGORY=zzz`
    `ESA_BOT_REACTION=zzz`
*/
import decode from "decode-html";

function handleReaction(res: any) {
  const message = res.message;
  const item = message.item;
  const reaction = message.reaction;
  const reactionType = message.type;
  if (reactionType === "added" && reaction === process.env.ESA_BOT_REACTION) {
    res.robot.adapter.client.web.channels.history(
      item.channel,
      {"oldest": item.ts.split(".")[0], "count": 1},
      (err: any, data: any) => {
        if (err) {
          res.send(`Failed to read thread :( ${err}`);
          console.log(err);
          console.log(data);
        } else if (data.messages.length > 0) {
          const text = decode(data.messages[0].text);
          const postData = JSON.stringify({
            "post": {
              "name": text.split(/\n/)[0],
              "body_md": text,
              "category": process.env.ESA_BOT_CATEGORY,
              "user": "esa_bot",
              "message": "Add post from slack"
            }
          });
          res.robot.http(`https://api.esa.io/v1/teams/${process.env.ESA_TEAM_NAME}/posts`)
            .header("Content-Type", "application/json")
            .header("Authorization", `Bearer ${process.env.ESA_ACCESS_TOKEN}`)
            .post(postData)((err2: any, r: any, body: any) => {
              if (err2) {
                res.send(`Failed to post esa :( ${err2}`);
                console.log(err2);
                console.log(r);
                console.log(body);
              } else {
                res.send(`Post to ${JSON.parse(body).url}`);
              }
            });
        }
      });
  }
}

function main(robot: any) {
  robot.hearReaction(handleReaction);
}

module.exports = main;
