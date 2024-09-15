import {
  ComboboxItem,
  Group,
  OptionsFilter,
  Select,
  SelectProps,
} from "@mantine/core";
import axios from "axios";
import { fonts, localFonts, localFontsFullName } from "../consts/fonts";
import { memo } from "react";

export const loadFont = async (url: string) => {
  const checkLocalFont =
    localFonts
      .map((font) => url.indexOf(font))
      .filter((checked) => checked > -1).length > 0;
  if (checkLocalFont) return;
  await axios.get(url);
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = url;
  document.head.appendChild(linkElement);
};

export const SelectFont = memo(function (props: {
  type: string;
  value?: string;
  onChange?: (font: { type: any; value?: string }) => void;
}) {
  const localFontName = (font: string) => {
    return font?.split("_")?.[1];
  };

  const isLocalFont = (font: string) => {
    return localFonts.indexOf(font) >= 0;
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      {!localFontName(option.label) && (
        <img
          className="tw-h-6"
          src={`/images/fonts/${option.label
            .toLowerCase()
            .split(" ")
            .join("-")}.png`}
        />
      )}
      {!!localFontName(option.label) && (
        <div
          className={`tw-uppercase tw-text-[16px] font-${localFontName(
            option.label
          )}`}
        >
          {localFontName(option.label)}
        </div>
      )}
    </Group>
  );
  const style = JSON.parse(localStorage.getItem("style") || "{}");
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) {
      return (options as ComboboxItem[]).slice(0, 20);
    }
    return (options as ComboboxItem[])
      .filter((option) => {
        const words = option.label.toLowerCase().trim();
        return words.startsWith(searchTerm);
      })
      .slice(0, 150);
  };
  return (
    <>
      <Select
        className="tw-w-full"
        placeholder="Select Font"
        data={[...localFontsFullName, ...fonts]}
        searchable
        renderOption={renderSelectOption}
        filter={optionsFilter}
        defaultValue={
          (isLocalFont(props.value!) ? `L_${props.value}` : props.value) ||
          style[props.type]?.family ||
          ""
        }
        onChange={(value) => {
          if (props.onChange) {
            props.onChange({
              value: !!localFontName(value!)
                ? `${localFontName(value!)}`
                : value!,
              type: props.type,
            });
          }
          value &&
            !localFontName(value) &&
            loadFont(`https://fonts.googleapis.com/css?family=${value}`);
        }}
      />
    </>
  );
});
