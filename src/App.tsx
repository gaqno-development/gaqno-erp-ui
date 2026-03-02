import { initI18n, I18nProvider } from "@gaqno-development/frontcore/i18n";
import { ERPLayout } from "./ERPLayout";

initI18n();

export default function App() {
  return (
    <I18nProvider>
      <ERPLayout />
    </I18nProvider>
  );
}
