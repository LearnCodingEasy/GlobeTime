import './assets/main.css'
// My Style
import "./assets/scss/style.scss";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000";

// Animate
import 'animate.css';

// --------------- PrimeVue Core Configuration ---------------
// Import PrimeVue library configuration
// استيراد مكتبة PrimeVue وإعداداتها الأساسية
import PrimeVue from "primevue/config";

// --------------- Popup Services (For Dialogs and Confirmations) ---------------
// Import services for confirmation and dialog popups
// خدمات النوافذ المنبثقة لتأكيد العمليات وفتح الحوارات
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";

// Buttons
// الأزرار وزر التبديل
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";

// --------------- Form Components ---------------
// Import components for creating forms
// عناصر النماذج
import Fluid from "primevue/fluid";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Password from "primevue/password";
import FloatLabel from "primevue/floatlabel";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import Listbox from "primevue/listbox";
import DatePicker from "primevue/datepicker";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import ColorPicker from "primevue/colorpicker";

// --------------- File Components ---------------
// Import file upload
// تحميل الملفات
import FileUpload from "primevue/fileupload";

// --------------- Menu Components ---------------
// Import components for building menus
// عناصر القائمة
import Menubar from "primevue/menubar";
import TieredMenu from "primevue/tieredmenu";

// --------------- Image Components ---------------
// Import components for handling images and avatars
// مكونات الصور والأفاتار
import Image from "primevue/image";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";

// --------------- Popup Components ---------------
// Import popover, dialog, and drawer components for popups
// مكونات النوافذ المنبثقة
import Popover from "primevue/popover";
import Dialog from "primevue/dialog";
import Drawer from "primevue/drawer";

// --------------- Panel Components ---------------
// Import panel-related components for layout and navigation
// مكونات اللوحات لعرض المعلومات المنظمة
import Fieldset from "primevue/fieldset";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import StepItem from "primevue/stepitem";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";

// --------------- Card Components ---------------
// Import card component for displaying content in card format
// مكون البطاقات لعرض المحتوى بطريقة منسقة
import Card from "primevue/card";

// --------------- Theme Components ---------------
// Import theme presets and theme switcher component
// مكونات اللوحات لعرض المعلومات المنظمة
import Noir from "./presets/Noir.js";
import ThemeSwitcher from "./components/Theme/ThemeSwitcher.vue";

// --------------- Notification Components ---------------
// Import toast and message components for notifications
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Message from "primevue/message";

// --------------- Icon Components ---------------
// Import icon components for enhanced UI elements
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

// --------------- Editor Components ---------------
// Import rich text editor component (Quill-based)
import Editor from "primevue/editor";

// --------------- Table Components ---------------
// Import table components for data presentation
// Quill محرر النصوص الغنية المستندة إلى
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional

// --------------- Placeholder Components ---------------
// Import skeleton component for loading placeholders
import Skeleton from "primevue/skeleton";

// --------------- Placeholder Components ---------------
// Badge is a small status indicator for another element.
import Badge from "primevue/badge";
import OverlayBadge from "primevue/overlaybadge";
import ProgressSpinner from 'primevue/progressspinner'
import Select from 'primevue/select';

import Divider from 'primevue/divider';

// --------------- Styles ---------------
// Import necessary styles for PrimeVue and Tailwind CSS
import "primeicons/primeicons.css";
import "tailwindcss/tailwind.css";

const app = createApp(App)

app.use(createPinia())
app.use(router)

// --------------- Initialize PrimeVue ---------------
// Configure and initialize PrimeVue with theme settings
app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: "p",
      darkModeSelector: ".p-dark",
      cssLayer: false,
    },
  },
});

// Initialize and add services
// تهيئة وإضافة الخدمات
app.use(ConfirmationService);
app.use(DialogService);
app.use(ToastService);

// --------------- Register Components ---------------
// Register components in the application for global usage
// Prime Button
app.component("prime_button", Button);

// Theme Switcher Component
// مكون تبديل السمة
app.component("ThemeSwitcher", ThemeSwitcher);

// Form Components
app.component("prime_fluid", Fluid);
app.component("prime_input_text", InputText);
app.component("prime_textarea", Textarea);
app.component("prime_input_password", Password);
app.component("prime_float_label", FloatLabel);
app.component("prime_check_box", Checkbox);
app.component("prime_radio_button", RadioButton);
app.component("prime_list_box", Listbox);
app.component("prime_date_picker", DatePicker);
app.component("prime_input_group", InputGroup);
app.component("prime_input_group_addon", InputGroupAddon);
app.component("prime_file_upload", FileUpload);
app.component("prime_toggle_button", ToggleButton);
app.component("prime_color_picker", ColorPicker);

// Menu Components
app.component("prime_menubar", Menubar);
app.component("prime_tiered_menu", TieredMenu);

// Image Components
app.component("prime_image", Image);
app.component("prime_avatar", Avatar);
app.component("prime_avatar_group", AvatarGroup);

// Card Components
app.component("prime_card", Card);

// Popup Components
app.component("prime_popover", Popover);
app.component("prime_dialog", Dialog);
app.component("prime_drawer", Drawer);

// Panel Components
app.component("prime_fieldset", Fieldset);
app.component("prime_stepper", Stepper);
app.component("prime_steplist", StepList);
app.component("prime_steppanels", StepPanels);
app.component("prime_stepitem", StepItem);
app.component("prime_step", Step);
app.component("prime_steppanel", StepPanel);

// Notification Components
app.component("prime_toast", Toast);
app.component("prime_message", Message);

// Icon Components
app.component("prime_icon_field", IconField);
app.component("prime_input_icon", InputIcon);

// Editor Component
app.component("prime_editor", Editor);

// Table Components
app.component("prime_data_table", DataTable);
app.component("prime_column", Column);
app.component("prime_column_group", ColumnGroup);
app.component("prime_row", Row);

// Placeholder Components
app.component("prime_skeleton", Skeleton);

// Badge is a small status indicator for another element.
app.component("prime_badge", Badge);
app.component("prime_overlay_badge", OverlayBadge);
app.component("prime_progress_spinner", ProgressSpinner);
app.component("prime_select", Select);
app.component("prime_divider", Divider);

app.mount('#app')
