import { Button, MantineProvider } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { SpeedLimitApp } from "./components/SpeedLimitApp";

const queryClient = new QueryClient();

function App() {
  const [isRunning, toggle] = useToggle([false, true]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <NotificationsProvider>
          <ModalsProvider>
            {isRunning ? <SpeedLimitApp /> : <Button onClick={() => toggle()}>Start</Button>}
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
