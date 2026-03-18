import { type RenderOptions, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";

const messages = {
  AreYouSureDialog: {
    title: "Are you absolutely sure?",
    description: "This action cannot be undone",
    cancel: "Cancel",
    proceed: "Yes",
  },
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale="pl" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: AllTheProviders, ...options }),
});

export {
  render as rtlRender,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
export { customRender as render };
