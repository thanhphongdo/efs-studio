import { EnglishPhraseProps } from "@/app/types/english-phrase";
import { EnglishRobinsonProps } from "@/app/types/english-robinson";
import { useEffect, useState } from "react";

const minLength = 200;
const maxLength = 400;
const minTense = 5;
const maxTense = 10;

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

export const EnglishRobinson = (
  props: EnglishRobinsonProps & { scale: string; part: number }
) => {
  const [parts, setParts] = useState<Array<string>>([]);
  useEffect(() => {
    if (parts.length) return;
    const texts = props.texts
      .split("\n")
      .filter((item) => item?.length)
      .map((item) => {
        if (item.length > maxLength) {
          const currentPart = item.split(".").filter((item) => item.trim());
          let firstText = "";
          let lastText = "";
          currentPart.forEach((subItem, index) => {
            if ((firstText + subItem).length <= maxLength) {
              firstText = `${firstText}${subItem}. `;
            } else {
              lastText = `${lastText}${subItem}. `;
            }
          });
          return `${firstText.trim()}\n${lastText.trim()}`;
        }
        return item;
      })
      .join("\n")
      .split("\n");
    texts.forEach((item, index) => {
      if (!parts[parts.length - 1]) {
        parts.push(item);
      } else {
        if (parts[parts.length - 1].length + item.length < maxLength) {
          parts[parts.length - 1] = `${parts[parts.length - 1]}\n${item}`;
        } else {
          parts.push(item);
        }
      }
    });
    setParts([...parts]);
  }, []);

  const isSmallMode = () => {
    return parts[props.part]?.length > maxLength;
  };

  return (
    <div
      className="tw-relative tw-w-[1920px] tw-h-[1080px] tw-bg-emerald-300 tw-bg-cover tw-bg-center"
      style={{
        backgroundImage: `url("${props.style?.background}")`,
        transform: `scale(${props.scale})`,
      }}
    >
      <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-gap-4 tw-px-32 tw-text-justify text-effect-1">
        {parts[props.part]?.split("\n").map((item, index) => {
          let prevIndex = -1;
          let hasMargin = false;
          let forceMargin = false;
          return (
            <div
              className={`${
                isSmallMode()
                  ? "tw-text-[2.9rem] tw-leading-[5.8rem]"
                  : "tw-text-[3rem] tw-leading-[6rem]"
              } tw-font-bold tw-text-green-600`}
              key={index}
            >
              {replaceKeywords(item, props.words)
                .split(" ")
                .map((word, wIndex) => {
                  const findWord = word
                    .replace(/[_\.\!\?\"\“\”]/g, " ")
                    .trim()
                    .toLowerCase();
                  const index = props.words.indexOf(findWord);
                  if (
                    props.words
                      .map((item) => item?.toLowerCase())
                      .includes(findWord)
                  ) {
                    let applyMargin = false;
                    const wordVn = props.words_vn[index];
                    if (wordVn && word && wordVn.length >= word.length * 2) {
                      forceMargin = true;
                      console.log(forceMargin, word, wordVn);
                    }
                    if (wIndex == prevIndex + 1) {
                      hasMargin = !hasMargin;
                    } else {
                      hasMargin = false;
                    }
                    if (
                      hasMargin &&
                      (wordVn.length >= word.length * 2 || forceMargin)
                    ) {
                      forceMargin = false;
                      applyMargin = true;
                    }
                    prevIndex = wIndex;
                    return (
                      <>
                        <span className="tw-relative">
                          <span className="tw-font-bold tw-text-green-800">
                            {word.replace(/_/g, " ")}
                          </span>
                          <div
                            className={`tw-absolute tw-top-[-3.3rem] tw-left-[-150%] tw-w-[400%] tw-text-center tw-text-[1.8rem] tw-text-amber-600 ${
                              applyMargin ? "!tw-top-[1.3rem]" : ""
                            }`}
                          >
                            {props.words_vn[index]}
                          </div>
                        </span>
                        <span> </span>
                      </>
                    );
                  }
                  return <span>{word} </span>;
                })}
            </div>
          );
        })}
      </div>
      <div className="tw-absolute tw-top-16 tw-left-12 tw-vintage-filter tw-text-[4rem] tw-text-amber-600 tw-font-bold tw-rounded-r-full tw-bg-amber-300/30 tw-px-8">
        Chapter {props?.chap?.toString().padStart(2, "0")} - {props.title}
      </div>
      <div className="tw-absolute tw-bottom-8 tw-left-6 tw-vintage-filter tw-text-[2rem] tw-text-amber-500 tw-font-bold">
        @EngliFunShine
      </div>
      <div className="tw-absolute tw-bottom-8 tw-right-6 tw-vintage-filter tw-text-[2rem] tw-text-amber-500 tw-font-bold">
        <span>Source: </span>
        <span className="tw-font-bold tw-underline">
          https://www.robinsoncrusoeinlevels.com
        </span>
      </div>
    </div>
  );
};
