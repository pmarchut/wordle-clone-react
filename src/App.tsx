import styles from "./App.module.scss"
import { useEffect } from "react"
import TheDialog from "./components/TheDialog"
import TheToolbar from "./components/TheToolbar"
import TheGame from "./components/TheGame"
import ToastContainer from "./components/ToastContainer"
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { hideDialog } from '@/stores/dialogsSlice'
import { initWords } from "./stores/wordsSlice"

function App() {
  const dialogs = useAppSelector((state) => state.dialogs);
  const dispatch = useAppDispatch()

  useEffect(() => {
    //test
    //console.log("App mounted")
    dispatch(initWords())
  }, [dispatch]);

  useEffect(() => {
    const darkMode = localStorage.getItem("wordle-darkmode");
    const colorblindMode = localStorage.getItem("wordle-colorblind");
    if (darkMode === "true") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    if (colorblindMode === "true") {
      document.body.classList.add("colorblind");
    } else {
      document.body.classList.remove("colorblind");
    }
  });

  const closeDialog = () => {
    dispatch(hideDialog());
  }

  return (
    <>
      <ToastContainer />
      <div 
        className={`${styles.gameContainer}`}
        data-testid="game-wrapper"
      >
        <TheToolbar />
        <TheGame />
      </div>
      {dialogs.dialog && 
      <TheDialog 
        dialog={dialogs.dialog}
        closeDialog={closeDialog}
      />}
    </>
  )
}

export default App
