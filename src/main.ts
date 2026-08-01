import { mount } from "svelte";
import App from "./App.svelte";
import "./styles.css";
import "./mobile.css";
import "./network.css";

mount(App, { target: document.getElementById("app")! });
