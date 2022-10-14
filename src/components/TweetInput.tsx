import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { storage, db, auth } from "../firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const TweetInput: React.FC = () => {
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    /** fromのonSubmitを実行した時のブラウザが自動でリフレッシュしてしまうのを防ぐ為のpreventDefault */
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxygABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      /**
       * storage.refの返り値をuploadTweetImageに格納することでon()メソッドが使える。
       * storageに対してなんらかのstateの変化があった場合に実行される後処理を追加することができる */
      const uploadTweetImage = storage
        .ref(`images/${fileName}`)
        .put(tweetImage);
      uploadTweetImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        /** アップロードの進捗を管理（今回はプログレス、進捗に関しては機能実装しないのでからの関数） */
        () => {},
        /** エラーのハンドリング */
        (err) => {
          alert(err.message);
        },
        /** 正常終了した時に実行される関数 */
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl, //投稿をしたユーザーのアバター画像
        image: "", //ツイートイメージ（ない場合なのでからのテキスト）
        text: tweetMsg, //ツイートのテキストのメッセージ
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), //投稿した時刻を取得
        username: user.displayName, //投稿したユーザーの名前（ログインしているユーザー）
      });
    }
    setTweetImage(null);
    setTweetMsg("");
  };

  const user = useSelector(selectUser);
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            className={styles.tweet_input}
            placeholder="What's happening?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
