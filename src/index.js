import React from "react";
import "react-dom";


import '../public/css/main.css';
import component from "./component";
import { bake } from "./shake";

console.log(React)

document.body.appendChild(component());
bake()