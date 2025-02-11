import React from "react";
import { CustomInput } from "./CustomizationComponnent/CustomInput";
import { NumberInput } from "./CustomizationComponnent/NumberInput";


const JsonToForm = ({ data = {}, predecessor = "" }) => {
  const keys = Object.keys(data)

  const switchForm = (value, key) => {
    const path = predecessor === "" ? key : predecessor + "." + key
    switch (value) {
      case "text":
        return <CustomInput name={path} />
      case "number":
        return <NumberInput name={path} />
      case "color":
        break;
      case "cardType":
        break;
      case "effectType":
        break;
      case "action":
        break;
      case "params":
        break;
      case "path":
        break;
      default:
        break;
    }
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {keys.map((item, index) => (
        <div key={index} className="shadow-md p-4 rounded-lg">
          {
            typeof data[item] !== "object" &&
            (<div>
              <h2 className="text-lg font-bold">{item}</h2>
              {switchForm(data[item], item)}
            </div>)
          }
          {
            typeof data[item] === "object" &&
            <JsonToForm data={data[item]} predecessor={predecessor === "" ? item : predecessor + "." + item} />
          }
        </div>
      ))}
    </div>
  );
};

export default JsonToForm;