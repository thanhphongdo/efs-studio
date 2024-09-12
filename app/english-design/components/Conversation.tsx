import { useEffect, useRef } from "react";
import { Shape } from "../store";
import { useEnglishVideo } from "../store-provider";

function replaceKeywords(text: string, keyWords: string[]): string {
  let regex = new RegExp(keyWords.join("|"), "gi");

  let replacedText = text.replace(regex, (match: string) => {
    let isUpperCase = match[0] === match[0]?.toUpperCase();
    let replacement = match.toLowerCase().replace(/\s+/g, "_");
    if (isUpperCase) {
      replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  });
  return replacedText;
}

export default function Conversation(props: {
  slideUUID: string;
  speechs: Array<{ character: string; speech: string }>;
  shape?: Shape;
}) {
  const { getConvertedDifficultWords, currentSlide } = useEnglishVideo(
    (s) => s
  );
  const conRef = useRef<HTMLDivElement>(null);
  const adjustFontSize = () => {
    if (!conRef.current) return;
    let fontSize = Math.ceil(
      props.speechs.reduce((length, item) => length + item.speech.length, 0) /
        10
    );
    if (fontSize < 20) {
      fontSize = 20;
    }

    conRef.current!.style.fontSize = fontSize + "px";

    while (conRef.current.scrollHeight > props.shape?.height!) {
      fontSize--;
      conRef.current.style.fontSize = fontSize + "px";
    }
  };
  useEffect(() => {
    adjustFontSize();
    let timer = setInterval(() => {
      if (conRef?.current?.scrollHeight! <= props.shape?.height! - 100) {
        clearInterval(timer);
      } else {
        adjustFontSize();
      }
      // adjustFontSize();
    }, 200);
    setTimeout(() => {
      clearInterval(timer);
    }, 1000);
    (window as any).adjustFontSize = function () {
      adjustFontSize();
    };
  }, [props.speechs, props.shape, currentSlide()]);
  return (
    <div
      ref={conRef}
      id="conversation"
      className="tw-flex tw-flex-col tw-gap-[1em]"
    >
      {props.speechs.map((item, index) => {
        let prevIndex = -1;
        let hasMargin = false;
        let forceMargin = false;
        const difficultWords = getConvertedDifficultWords(props.slideUUID);
        return (
          <div
            key={index}
            className={`tw-leading-[4.7em] ${
              item.character
                ? ""
                : "tw-italic tw-font-semibold tw-text-green-800 tw-leading-[5.22em]"
            }`}
            style={{ fontSize: item.character ? "inherit" : `0.9em` }}
          >
            <span className="tw-text-[3.2em] tw-font-extrabold">
              {item.character ? `${item.character}: ` : ""}
            </span>
            {replaceKeywords(
              item.speech,
              getConvertedDifficultWords(props.slideUUID).en
            )
              .split(" ")
              .map((word, wIndex) => {
                const findWord = word
                  .replace(/[_\.\,\:\!\?\"\“\”]/g, " ")
                  .trim()
                  .toLowerCase();
                const index = difficultWords.en.indexOf(findWord);
                if (
                  difficultWords.en
                    .map((item) => item?.toLowerCase())
                    .includes(findWord)
                ) {
                  let applyMargin = false;
                  const wordVn = difficultWords.vi[index];
                  if (wordVn && word && wordVn.length >= word.length * 2 - 2) {
                    forceMargin = true;
                  }
                  if (wIndex == prevIndex + 1) {
                    hasMargin = !hasMargin;
                  } else {
                    hasMargin = false;
                  }
                  if (
                    hasMargin &&
                    wordVn &&
                    word &&
                    (wordVn.length >= word.length * 2 || forceMargin)
                  ) {
                    forceMargin = false;
                    applyMargin = true;
                  }
                  prevIndex = wIndex;
                  return (
                    <>
                      <span className="tw-relative">
                        <span className="tw-font-bold tw-text-amber-600 tw-text-[3em] tw-inline-block tw-mr-[0.3em]">
                          {word.replace(/_/g, " ")}{" "}
                        </span>
                        <div
                          className={`tw-absolute tw-top-[-2.4em] tw-left-[-150%] tw-w-[400%] tw-text-center tw-text-[2em] tw-text-amber-900 ${
                            applyMargin ? "!tw-top-[0.1em]" : ""
                          }`}
                        >
                          {difficultWords.vi[index]}
                        </div>
                      </span>
                    </>
                  );
                }
                return <span className="tw-text-[3em]">{word} </span>;
              })}
          </div>
        );
      })}
    </div>
  );
}
