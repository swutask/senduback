// "use client";
// // import { PageLoading } from "@/components/shared/page-loading";
// import { persistor, store } from "@/redux/store";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";

// const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <Provider store={store}>
//       {/* <PersistGate loading={<PageLoading />} persistor={persistor}> */}
//       {children}
//       {/* </PersistGate> */}
//     </Provider>
//   );
// };

// export default ReduxProvider;

"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Toaster } from "sonner";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster />
      </PersistGate>
    </Provider>
  );
}
