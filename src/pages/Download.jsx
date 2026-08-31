import Navbar from "../components/Navbar";

export default function Download() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-6 pt-20">
        <h1 className="font-heading text-4xl font-black tracking-tight md:text-6xl">Download</h1>
      </main>
    </div>
  );
}
