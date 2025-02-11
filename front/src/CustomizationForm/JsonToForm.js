import React from "react";
import { CustomInput } from "./CustomizationComponnent/CustomInput";
import { NumberInput } from "./CustomizationComponnent/NumberInput";
import { useState } from "react";
import { ExpandLess } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";
import { ColorPicker } from "./CustomizationComponnent/ColorPicker";

const JsonToForm = ({ data = {}, predecessor = "" }) => {
  const keys = Object.keys(data)

  return (
    <div style={{ paddingLeft: '8px' }}>
      {keys.map((item, index) => {
        return (
          <div className="shadow-md p-4 rounded-lg">

            <div>
              <DropDown item={item} predecessor={predecessor} data={data} />
            </div>
          </div>
        )
      })}
    </div>
  );
};

const switchForm = (value, key, predecessor) => {
  const path = predecessor === "" ? key : predecessor + "." + key
  switch (value) {
    case "text":
      return <CustomInput name={path} />
    case "number":
      return <NumberInput name={path} />
    case "color":
      return <ColorPicker name={path} />
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

const DropDown = ({ item, data, predecessor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="display: flex">
      <h2 style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)} className="text-lg font-bold cursor:pointer">
        {item}
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </h2>
      {isOpen && typeof data[item] !== "object" &&
        <div style={{ paddingLeft: '8px' }}>
          {switchForm(data[item], item, predecessor)}
        </div>
      }
      {
        isOpen && typeof data[item] === "object" &&
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


// ajouter chaque custom widget
// connecter au back (envoie carte, recup carte)

export default JsonToForm;