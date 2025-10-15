export default function NavBar() {
  return (
    <nav className="bg-green-600 text-white p-4 flex items-center justify-between">
      <div className="font-bold text-xl">SnapFIT</div>
      <div className="flex gap-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/tracker" className="hover:underline">Calorie Tracker</a>
        <a href="/scan" className="hover:underline">Body Scan</a>
      </div>
    </nav>
  );
}

