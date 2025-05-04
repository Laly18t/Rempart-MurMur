import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import UIlayer from "./componants/UI/UIlayer";

const root = createRoot(document.getElementById("root"));
root.render (<>
    <App />
    <UIlayer />
</>);
