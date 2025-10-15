import NavBar from '../components/NavBar'

export default function Tracker() {
  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-600">Calorie Tracker</h2>
        <p className="mt-4">Demo Mode: AI calorie scanning coming soon 👀</p>
      </div>
    </div>
  );
}

