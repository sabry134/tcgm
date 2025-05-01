import React from "react";
import { CustomInput } from "./CustomizationComponnent/CustomInput";
import { NumberInput } from "./CustomizationComponnent/NumberInput";
import { useState } from "react";
import { ColorPicker } from "./CustomizationComponnent/ColorPicker";
import { CardTypePicker } from "./CustomizationComponnent/CardTypePicker";
import { GamePicker } from "./CustomizationComponnent/GamePicker";
import './JsonToForm.css'
import { CustomCheckbox } from "./CustomizationComponnent/CustomCheckbox";


const JsonToForm = ({ data = {}, predecessor = "", localStorageName = "currentEditedCard" }) => {
  const keys = Object.keys(data)
  return (
    <div style={{
      overflowY: 'scroll',
      margin: "10px",
      marginTop: '15px',
      maxHeight: '90vh'
    }}>
      {keys.map((item, index) => {
        return (
          <div key={index} hidden={data[item] === 'none'} >
            <div>
              <DropDown isFirst={index === 0} isLast={index === keys.length - 1} item={item} predecessor={predecessor} data={data} localStorageName={localStorageName} />
            </div>
          </div>
        )
      })}
    </div>
  );
};

const switchForm = (value, key, predecessor, localStorageName) => {
  const path = predecessor === "" ? key : predecessor + "." + key
  switch (value) {
    case "text":
      return <CustomInput name={path} localStorageName={localStorageName} />
    case "number":
      return <NumberInput name={path} localStorageName={localStorageName} />
    case "color":
      return <ColorPicker name={path} localStorageName={localStorageName} />
    case "cardType":
      return <CardTypePicker name={path} localStorageName={localStorageName} />;
    case "game":
      return <GamePicker name={path} localStorageName={localStorageName} />
    case "boolean":
      return <CustomCheckbox name={path} localStorageName={localStorageName} />;
    case "params":
      break;
    case "path":
      break;
    default:
      break;
  }
}

const DropDown = ({ item, data, predecessor, localStorageName, isFirst, isLast }) => {

  const switchTitle = (value) => {
    const newValue = value.replace(/_/g, ' ');

    switch (newValue) {
      case "effect ids":
        return "effects"
      case "card type id":
        return "card type"
      case "property name":
        return "Name"
      default:
        return newValue.charAt(0).toUpperCase() + newValue.slice(1);
    }
  }

  return (
    <div className={"customFormItem " + (isFirst ? "first" : "") + (isLast ? "last" : "")} >
      <h2 className={"customFormName " + (isFirst ? "first" : "") + (isLast ? "last" : "")}>
        {switchTitle(item)}
      </h2>
      {typeof data[item] !== "object" &&
        <div className="customFormInput">
          {switchForm(data[item], item, predecessor, localStorageName)}
        </div>
      }
      {
        typeof data[item] === "object" &&
        <JsonToForm
          data={data[item]}
          predecessor={predecessor === "" ?
            item :
            predecessor + "." + item}
        />
      }
    </div>
  );
}

export default JsonToForm;