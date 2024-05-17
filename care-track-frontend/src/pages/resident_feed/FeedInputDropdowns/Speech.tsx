import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

interface props {
  note: string;
  setNote: (newNote: string) => void;
  isListening: boolean;
  setIsListening: (newState: boolean) => void;
}

function Speech({ setNote, isListening, setIsListening }: props) {
  useEffect(() => {
    handleListen();
  }, [isListening]);

  /**
   * Handles the logic for starting and stopping the microphone, as well as processing the audio input.
   *
   * When the microphone is started, it will continuously record audio and update the `note` state with the transcribed text.
   * When the microphone is stopped, it will log a message to the console.
   *
   * The microphone is started and stopped based on the `isListening` state.
   */
  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");
      setNote(transcript);
      mic.onerror = (event: any) => {
        console.log(event.error);
      };
    };
  };

  /**
   * Renders a button that allows the user to start or stop recording audio.
   * When the button is clicked, it toggles the `isListening` state, which determines whether the audio recording should start or stop.
   * The button's label changes based on the current state of `isListening`.
   */
  return (
    <>
      <Button
        type="button"
        size={"sm"}
        variant={"outline"}
        onClick={() => setIsListening(!isListening)}
        className=" w-fit px-6 border-gray-400 mx-2"
      >
        {isListening ? "Stop" : "Record"}
      </Button>
    </>
  );
}

export default Speech;
