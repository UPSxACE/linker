import { Button } from "@mantine/core";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <h1>Hello World!</h1>
      <Button variant="outline" color="mainColor.4">
        Violet Button Hopefully
      </Button>
    </main>
  );
}
