import {
  ComboboxItem,
  Group,
  OptionsFilter,
  Select,
  SelectProps,
} from "@mantine/core";
import axios from "axios";
import { fonts } from "../consts/fonts";
import { memo } from "react";

export const loadFont = async (url: string) => {
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
  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      <img
        className="tw-h-6"
        src={`/images/fonts/${option.label
          .toLowerCase()
          .split(" ")
          .join("-")}.png`}
      />
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
        data={fonts}
        searchable
        renderOption={renderSelectOption}
        filter={optionsFilter}
        defaultValue={props.value || style[props.type]?.family || ""}
        onChange={(value) => {
          if (props.onChange) {
            props.onChange({ value: value!, type: props.type });
          }
          loadFont(`https://fonts.googleapis.com/css?family=${value}`);
        }}
      />
    </>
  );
});
