import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import "./assets/main.css"
import router from "./router"   // Importation du routeur

const app = createApp(App)

app.use(createPinia())
app.use(router) // Active le routeur dans l'application
app.mount("#app")
