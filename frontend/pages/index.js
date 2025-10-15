import NavBar from '../components/NavBar'

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-green-600">Welcome to SnapFIT</h1>
        <p className="mt-4 text-gray-700">
          AI Fitness & Nutrition Assistant (Demo Version)
        </p>
      </div>
    </div>
  );
}

