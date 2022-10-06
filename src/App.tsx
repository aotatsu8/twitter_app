import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    /**
     * onAuthStateChangedはfirebaseのuserに配して変化があったときに毎回呼び出される。
     * 実行されるとサブスクライブが始まり監視がはじまる。返り値にアンサブスクライブする関数が返る。
     * 引数には変化後のuser情報が格納される。
     */
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
